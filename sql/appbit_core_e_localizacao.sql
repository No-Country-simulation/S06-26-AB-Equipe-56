-- ===========================================================
-- Núcleo App BiT (subconjunto mínimo, só o necessário para
-- testar a integração de localização com o Vísent CDRView)
-- ===========================================================

CREATE TABLE Empresa (
    empresa_id serial PRIMARY KEY,
    nome varchar(150) NOT NULL,
    razao_social varchar(150),
    cnpj varchar(18) UNIQUE,
    data_cadastro timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Permissoes (
    permissao_id serial PRIMARY KEY,
    nome varchar(30) NOT NULL
);

CREATE TABLE Recrutadores (
    recrutador_id serial PRIMARY KEY,
    nome varchar(150) NOT NULL,
    email varchar(150) UNIQUE NOT NULL,
    senha varchar(255) NOT NULL,
    empresa_id int NOT NULL REFERENCES Empresa (empresa_id),
    permissao_id int NOT NULL REFERENCES Permissoes (permissao_id),
    data_cadastro timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Cargos (
    cargo_id serial PRIMARY KEY,
    nome varchar(100) NOT NULL
);

CREATE TABLE Senioridades (
    senioridade_id serial PRIMARY KEY,
    nome varchar(30) NOT NULL
);

CREATE TABLE Modalidades (
    modalidade_id serial PRIMARY KEY,
    nome varchar(20) NOT NULL -- remoto, hibrido, presencial
);

CREATE TABLE Badges (
    badge_id serial PRIMARY KEY,
    nome varchar(100) NOT NULL
);

CREATE TABLE Skills (
    skill_id serial PRIMARY KEY,
    tipo_skill varchar(30) NOT NULL,
    nome_skill varchar(100) NOT NULL
);

CREATE TABLE Candidatos (
    candidato_id serial PRIMARY KEY,
    nome varchar(150) NOT NULL,
    email varchar(150) UNIQUE NOT NULL,
    senha varchar(255) NOT NULL,
    telefone varchar(20),
    cpf varchar(14) UNIQUE,
    data_cadastro timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Curriculo (
    curriculo_id serial PRIMARY KEY,
    candidato_id int NOT NULL REFERENCES Candidatos (candidato_id),
    data_cadastro timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Skills_Curriculo (
    skill_curriculo_id serial PRIMARY KEY,
    skill_id int NOT NULL REFERENCES Skills (skill_id),
    curriculo_id int NOT NULL REFERENCES Curriculo (curriculo_id),
    nivel_skill varchar(20)
);

CREATE TABLE Badges_Candidato (
    badge_candidato_id serial PRIMARY KEY,
    badge_id int NOT NULL REFERENCES Badges (badge_id),
    candidato_id int NOT NULL REFERENCES Candidatos (candidato_id)
);

CREATE TABLE Vagas (
    vaga_id serial PRIMARY KEY,
    recrutador_id int NOT NULL REFERENCES Recrutadores (recrutador_id),
    empresa_id int NOT NULL REFERENCES Empresa (empresa_id),
    titulo varchar(150) NOT NULL,
    descricao text,
    cargo_id int REFERENCES Cargos (cargo_id),
    senioridade_id int REFERENCES Senioridades (senioridade_id),
    modalidade_id int REFERENCES Modalidades (modalidade_id),
    data_cadastro timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Skills_Vaga (
    skill_vaga_id serial PRIMARY KEY,
    skill_id int NOT NULL REFERENCES Skills (skill_id),
    vaga_id int NOT NULL REFERENCES Vagas (vaga_id),
    nivel_skill varchar(20),
    obrigatorio boolean NOT NULL DEFAULT false,
    peso numeric(4,2) NOT NULL DEFAULT 1.0
);

-- ===========================================================
-- MÓDULO DE LOCALIZAÇÃO — integra Candidatos/Vagas ao Vísent
-- ===========================================================

-- Localização do candidato, com histórico (segue o padrão já
-- usado em ExperienciaCandidato: is_atual + data_inicio/data_fim).
-- cluster_nome é o vínculo com o dataset Vísent CDRView: pode
-- ser calculado automaticamente (antena/cluster mais próximo de
-- lat/lng) no cadastro, ou herdado do CEP informado.
CREATE TABLE CandidatoLocalizacao (
    localizacao_id bigserial PRIMARY KEY,
    candidato_id int NOT NULL REFERENCES Candidatos (candidato_id),
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    cluster_nome varchar(50) REFERENCES VisentCluster (cluster_nome),
    cep varchar(9),
    cidade varchar(80),
    uf char(2),
    data_inicio timestamp NOT NULL DEFAULT now(),
    data_fim timestamp,
    is_atual boolean NOT NULL DEFAULT true
);

-- Garante no máximo 1 endereço "atual" por candidato
CREATE UNIQUE INDEX uq_candidato_localizacao_atual
    ON CandidatoLocalizacao (candidato_id)
    WHERE is_atual;

CREATE INDEX idx_candidato_localizacao_cluster
    ON CandidatoLocalizacao (cluster_nome);

-- Localização da vaga: não precisa de histórico (a vaga é
-- publicada uma vez). Só faz sentido para presencial/híbrido,
-- mas fica nullable para não travar vagas remotas.
ALTER TABLE Vagas
    ADD COLUMN latitude numeric(9,6),
    ADD COLUMN longitude numeric(9,6),
    ADD COLUMN cluster_nome varchar(50) REFERENCES VisentCluster (cluster_nome),
    ADD COLUMN cidade varchar(80),
    ADD COLUMN uf char(2);

CREATE INDEX idx_vagas_cluster ON Vagas (cluster_nome);

-- ===========================================================
-- VIEW para o GET /insights
-- mapa_talentos: [{ regiao, concentracao, cobertura_rede, perfis_disponiveis }]
-- - concentracao: nº de candidatos com localização atual no cluster
-- - cobertura_rede: qualidade média de rede das antenas do cluster
--   (baseado em drop_pct_medio/congestionamento_medio do período mais
--   recente carregado em VisentConcentracaoAntena)
-- - perfis_disponiveis: nº de perfis distintos com pelo menos 1 skill
--   cadastrada, candidatos residentes no cluster
-- ===========================================================
CREATE VIEW VwInsightsRegiao AS
WITH rede_por_cluster AS (
    SELECT
        a.cluster_nome,
        avg(c.drop_pct_medio) AS drop_pct_medio,
        avg(c.congestionamento_medio) AS congestionamento_medio,
        CASE
            WHEN avg(c.congestionamento_medio) < 0.30 THEN 'BOA'
            WHEN avg(c.congestionamento_medio) < 0.40 THEN 'MEDIA'
            ELSE 'RUIM'
        END AS cobertura_rede
    FROM VisentConcentracaoAntena c
    JOIN VisentAntena a ON a.ecgi = c.ecgi
    GROUP BY a.cluster_nome
),
talentos_por_cluster AS (
    SELECT
        cl.cluster_nome,
        count(DISTINCT cl.candidato_id) AS concentracao,
        count(DISTINCT sc.skill_id) AS perfis_disponiveis
    FROM CandidatoLocalizacao cl
    JOIN Curriculo cu ON cu.candidato_id = cl.candidato_id
    LEFT JOIN Skills_Curriculo sc ON sc.curriculo_id = cu.curriculo_id
    WHERE cl.is_atual
    GROUP BY cl.cluster_nome
)
SELECT
    vc.cluster_nome AS regiao,
    coalesce(t.concentracao, 0) AS concentracao,
    coalesce(r.cobertura_rede, 'SEM_DADOS') AS cobertura_rede,
    coalesce(t.perfis_disponiveis, 0) AS perfis_disponiveis
FROM VisentCluster vc
LEFT JOIN talentos_por_cluster t ON t.cluster_nome = vc.cluster_nome
LEFT JOIN rede_por_cluster r ON r.cluster_nome = vc.cluster_nome
ORDER BY concentracao DESC;
