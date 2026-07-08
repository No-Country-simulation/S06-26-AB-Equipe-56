-- ===========================================================
-- Módulo Vísent CDRView — Dados de mobilidade telecom
-- Camada de staging/referência para geolocalização.
-- Ainda não possui FK para Candidatos/Vagas (conforme nota
-- original do schema: "geolocalização ficará para modelagem
-- posterior"). Este módulo prepara o terreno para isso.
-- ===========================================================

-- -----------------------------------------------------------
-- Dimensão de cluster geográfico (bairro/região usado como
-- unidade de agregação em todos os tensores). Um cluster pode
-- ter antenas em mais de um município (ex: ESTREITO_CAPOEIRAS
-- aparece em Florianópolis e São José), por isso o município
-- aqui é o "predominante" e não uma FK rígida por antena.
-- Alguns clusters citados em assinantes.csv não têm antena
-- cadastrada em antenas_flp.csv (ex: ANTONIO_CARLOS,
-- GOV_CELSO_RAMOS) — nesse caso município/centróide ficam nulos.
-- -----------------------------------------------------------
CREATE TABLE VisentCluster (
    cluster_nome varchar(50) PRIMARY KEY,
    municipio_predominante varchar(50),
    lat_centroide numeric(9,6),
    lon_centroide numeric(9,6)
);

-- -----------------------------------------------------------
-- antenas_flp.csv — antenas (ECGI) por cluster/município
-- -----------------------------------------------------------
CREATE TABLE VisentAntena (
    ecgi bigint PRIMARY KEY,
    cluster_nome varchar(50) NOT NULL,
    municipio varchar(50) NOT NULL,
    lat numeric(9,6) NOT NULL,
    lon numeric(9,6) NOT NULL,
    CONSTRAINT fk_antena_cluster FOREIGN KEY (cluster_nome)
        REFERENCES VisentCluster (cluster_nome)
);

-- -----------------------------------------------------------
-- assinantes.csv — base pseudonimizada de assinantes (200k
-- linhas). assinante_hash é um identificador sequencial já
-- anonimizado na origem: não é PII e não deve ser tratado como
-- FK direta para Candidatos (é agregado/estatístico).
-- -----------------------------------------------------------
CREATE TABLE VisentAssinante (
    assinante_hash int PRIMARY KEY,
    home_cluster varchar(50) NOT NULL,
    home_municipio varchar(50),
    income_cluster char(1) NOT NULL,       -- A, B, C, D
    age_group varchar(10) NOT NULL,        -- 18-24, 25-34, ...
    mobility_pattern varchar(10) NOT NULL, -- BAIXA, MODERADA, INTENSA
    flag_flagship boolean NOT NULL,
    CONSTRAINT fk_assinante_cluster FOREIGN KEY (home_cluster)
        REFERENCES VisentCluster (cluster_nome)
);

-- -----------------------------------------------------------
-- tensor_concentracao.csv — concentração de uso por antena,
-- dia e período (madrugada/manhã/tarde/noite)
-- -----------------------------------------------------------
CREATE TABLE VisentConcentracaoAntena (
    concentracao_id bigserial PRIMARY KEY,
    ecgi bigint NOT NULL,
    day_date date NOT NULL,
    periodo varchar(10) NOT NULL, -- MADRUGADA, MANHA, TARDE, NOITE
    n_usuarios int NOT NULL,
    n_sessoes int NOT NULL,
    download_bytes bigint NOT NULL,
    upload_bytes bigint NOT NULL,
    dur_media_s int NOT NULL,
    drop_pct_medio numeric(6,4) NOT NULL,
    congestionamento_medio numeric(6,4) NOT NULL,
    chamadas_total int NOT NULL,
    mensagens_total int NOT NULL,
    CONSTRAINT fk_concentracao_antena FOREIGN KEY (ecgi)
        REFERENCES VisentAntena (ecgi),
    CONSTRAINT uq_concentracao UNIQUE (ecgi, day_date, periodo)
);

-- -----------------------------------------------------------
-- tensor_fluxo_vias.csv — fluxo de deslocamento antena a
-- antena (granularidade fina, 17k+ linhas)
-- -----------------------------------------------------------
CREATE TABLE VisentFluxoVias (
    fluxo_id bigserial PRIMARY KEY,
    ecgi_origem bigint NOT NULL,
    ecgi_destino bigint NOT NULL,
    n_usuarios int NOT NULL,
    n_transicoes int NOT NULL,
    dist_km numeric(7,3) NOT NULL,
    periodo_predominante varchar(10) NOT NULL,
    pct_do_cluster_origem numeric(5,2) NOT NULL,
    CONSTRAINT fk_fluxo_origem FOREIGN KEY (ecgi_origem)
        REFERENCES VisentAntena (ecgi),
    CONSTRAINT fk_fluxo_destino FOREIGN KEY (ecgi_destino)
        REFERENCES VisentAntena (ecgi)
);

-- -----------------------------------------------------------
-- tensor_od.csv + trajetos_comuns.csv — origem/destino por
-- CLUSTER (nível mais agregado que fluxo_vias). Os dois
-- arquivos têm o mesmo schema; unificados aqui numa só tabela,
-- com "arquivo_origem" para rastrear a procedência.
-- ATENÇÃO: os valores numéricos (n_usuarios, n_viagens,
-- dist_media_km) são IDÊNTICOS entre tensor_od.csv (rotulado
-- NOITE) e trajetos_comuns.csv (rotulado TARDE) para os mesmos
-- pares de cluster — parece duplicação/erro de geração no
-- dataset mock, não dois períodos reais distintos. Vale
-- confirmar com quem gerou os dados antes de usar em produção.
-- -----------------------------------------------------------
CREATE TABLE VisentFluxoCluster (
    od_id bigserial PRIMARY KEY,
    cluster_origem varchar(50) NOT NULL,
    cluster_destino varchar(50) NOT NULL,
    mesmo_cluster boolean NOT NULL,
    n_usuarios int NOT NULL,
    n_viagens int NOT NULL,
    dist_media_km numeric(7,3) NOT NULL,
    periodo_predominante varchar(10) NOT NULL,
    arquivo_origem varchar(30) NOT NULL, -- 'tensor_od' | 'trajetos_comuns'
    CONSTRAINT fk_od_cluster_origem FOREIGN KEY (cluster_origem)
        REFERENCES VisentCluster (cluster_nome),
    CONSTRAINT fk_od_cluster_destino FOREIGN KEY (cluster_destino)
        REFERENCES VisentCluster (cluster_nome)
);

-- -----------------------------------------------------------
-- tensor_tempo_deslocamento.csv — estatísticas de distância
-- (p25/p75) por par de cluster
-- -----------------------------------------------------------
CREATE TABLE VisentTempoDeslocamento (
    tempo_id bigserial PRIMARY KEY,
    cluster_origem varchar(50) NOT NULL,
    cluster_destino varchar(50) NOT NULL,
    mesmo_cluster boolean NOT NULL,
    n_observacoes int NOT NULL,
    dist_media_km numeric(7,3) NOT NULL,
    dist_p25_km numeric(7,3) NOT NULL,
    dist_p75_km numeric(7,3) NOT NULL,
    periodo_predominante varchar(10) NOT NULL,
    CONSTRAINT fk_tempo_cluster_origem FOREIGN KEY (cluster_origem)
        REFERENCES VisentCluster (cluster_nome),
    CONSTRAINT fk_tempo_cluster_destino FOREIGN KEY (cluster_destino)
        REFERENCES VisentCluster (cluster_nome)
);

-- -----------------------------------------------------------
-- sumario_kanon.csv — metadados de anonimização k-anônima do
-- dataset (tabela pequena, chave/valor)
-- -----------------------------------------------------------
CREATE TABLE VisentSumarioKanon (
    parametro varchar(50) PRIMARY KEY,
    valor varchar(100) NOT NULL
);
