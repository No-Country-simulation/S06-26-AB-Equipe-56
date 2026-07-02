-- ===========================================================
-- App BiT - Modelo de dados (PostgreSQL)
-- Corrigido: tipos válidos + IDs incrementais (IDENTITY)
-- ===========================================================

CREATE TABLE Empresa (
  empresa_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20) UNIQUE NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Permissoes (
  permissao_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE Recrutadores (
  recrutador_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  empresa_id INT NOT NULL,
  permissao_id INT NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Convites (
  convite_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  empresa_id INT NOT NULL,
  email_convidado VARCHAR(255) NOT NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  status VARCHAR(50) NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT now(),
  data_expiracao TIMESTAMP NOT NULL
);

-- ===========================================================
-- Trilhas de conhecimento (D&I) para Recrutadores
-- ===========================================================

CREATE TABLE Trilhas (
  trilha_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_criacao TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Modulos (
  modulo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trilha_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  conteudo_url VARCHAR(500),
  duracao_minutos INT,
  ordem INT NOT NULL
);

CREATE TABLE Questionarios (
  questionario_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  modulo_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  nota_minima_aprovacao NUMERIC(5,2) NOT NULL,
  tentativas_permitidas INT NOT NULL DEFAULT 1
);

CREATE TABLE Questoes (
  questao_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  questionario_id INT NOT NULL,
  enunciado TEXT NOT NULL,
  ordem INT NOT NULL
);

CREATE TABLE AlternativasQuestao (
  alternativa_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  questao_id INT NOT NULL,
  texto TEXT NOT NULL,
  correta BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE Recrutadores_Trilhas (
  recrutador_trilha_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recrutador_id INT NOT NULL,
  trilha_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  data_inicio TIMESTAMP,
  data_conclusao TIMESTAMP
);

CREATE TABLE Recrutadores_Modulos (
  recrutador_modulo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recrutador_id INT NOT NULL,
  modulo_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  data_inicio TIMESTAMP,
  data_conclusao TIMESTAMP
);

CREATE TABLE RespostasRecrutador (
  resposta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recrutador_id INT NOT NULL,
  questionario_id INT NOT NULL,
  questao_id INT NOT NULL,
  alternativa_id INT NOT NULL,
  tentativa INT NOT NULL DEFAULT 1,
  correta BOOLEAN NOT NULL,
  data_resposta TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE ResultadosQuestionario (
  resultado_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recrutador_id INT NOT NULL,
  questionario_id INT NOT NULL,
  tentativa INT NOT NULL DEFAULT 1,
  total_questoes INT NOT NULL,
  total_acertos INT NOT NULL,
  total_erros INT NOT NULL,
  nota NUMERIC(5,2) NOT NULL,
  aprovado BOOLEAN NOT NULL,
  data_realizacao TIMESTAMP NOT NULL DEFAULT now()
);

-- ===========================================================
-- Domínio para padronização (Vagas x Experiência)
-- ===========================================================

CREATE TABLE Cargos (
  cargo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE Senioridades (
  senioridade_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE Modalidades (
  modalidade_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

CREATE TABLE Vagas (
  vaga_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recrutador_id INT NOT NULL,
  empresa_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  cargo_id INT NOT NULL,
  senioridade_id INT NOT NULL,
  modalidade_id INT NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Candidatos (
  candidato_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Curriculo (
  curriculo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  candidato_id INT NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Candidatura (
  candidatura_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  curriculo_id INT NOT NULL,
  vaga_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  pretencao_salarial DOUBLE PRECISION,
  data_candidatura TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Skills (
  skill_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo_skill VARCHAR(100) NOT NULL,
  nome_skill VARCHAR(255) NOT NULL
);

CREATE TABLE Skills_Curriculo (
  skill_curriculo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  skill_id INT NOT NULL,
  curriculo_id INT NOT NULL
);

CREATE TABLE Skills_Vaga (
  skill_vaga_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  skill_id INT NOT NULL,
  vaga_id INT NOT NULL,
  nivel_skill VARCHAR(50) NOT NULL,
  obrigatorio BOOLEAN NOT NULL DEFAULT false,
  peso NUMERIC(5,2) NOT NULL DEFAULT 1
);

CREATE TABLE ExperienciaCandidato (
  experiencia_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  curriculo_id INT NOT NULL,
  cargo_id INT NOT NULL,
  salario DOUBLE PRECISION,
  senioridade_id INT NOT NULL,
  descricao TEXT,
  empresa VARCHAR(255),
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  is_atual BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE Escolaridade (
  escolaridade_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  curriculo_id INT NOT NULL,
  nome_instituicao VARCHAR(255) NOT NULL,
  curso VARCHAR(255) NOT NULL,
  tipo_escolaridade VARCHAR(100) NOT NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  modalidade VARCHAR(50) NOT NULL,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP
);

CREATE TABLE Badges (
  badge_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE Badges_Candidato (
  badge_candidato_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  badge_id INT NOT NULL,
  candidato_id INT NOT NULL
);

CREATE TABLE MetasESG (
  meta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  empresa_id INT NOT NULL,
  badge_id INT NOT NULL,
  porcentagem NUMERIC(5,2),
  quantidade NUMERIC(10,2)
);

CREATE TABLE Contratacao (
  contratacao_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  candidatura_id INT NOT NULL,
  salario NUMERIC(10,2) NOT NULL
);

CREATE TABLE AderenciaMetasESG (
  aderencia_meta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  meta_id INT NOT NULL,
  contratacao_id INT NOT NULL
);

-- ===========================================================
-- Foreign Keys
-- ===========================================================

ALTER TABLE Recrutadores ADD FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Recrutadores ADD FOREIGN KEY (permissao_id) REFERENCES Permissoes (permissao_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Convites ADD FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Convites ADD FOREIGN KEY (email_convidado) REFERENCES Recrutadores (email) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Modulos ADD FOREIGN KEY (trilha_id) REFERENCES Trilhas (trilha_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Questionarios ADD FOREIGN KEY (modulo_id) REFERENCES Modulos (modulo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Questoes ADD FOREIGN KEY (questionario_id) REFERENCES Questionarios (questionario_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE AlternativasQuestao ADD FOREIGN KEY (questao_id) REFERENCES Questoes (questao_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Recrutadores_Trilhas ADD FOREIGN KEY (recrutador_id) REFERENCES Recrutadores (recrutador_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Recrutadores_Trilhas ADD FOREIGN KEY (trilha_id) REFERENCES Trilhas (trilha_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Recrutadores_Modulos ADD FOREIGN KEY (recrutador_id) REFERENCES Recrutadores (recrutador_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Recrutadores_Modulos ADD FOREIGN KEY (modulo_id) REFERENCES Modulos (modulo_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE RespostasRecrutador ADD FOREIGN KEY (recrutador_id) REFERENCES Recrutadores (recrutador_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE RespostasRecrutador ADD FOREIGN KEY (questionario_id) REFERENCES Questionarios (questionario_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE RespostasRecrutador ADD FOREIGN KEY (questao_id) REFERENCES Questoes (questao_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE RespostasRecrutador ADD FOREIGN KEY (alternativa_id) REFERENCES AlternativasQuestao (alternativa_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ResultadosQuestionario ADD FOREIGN KEY (recrutador_id) REFERENCES Recrutadores (recrutador_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE ResultadosQuestionario ADD FOREIGN KEY (questionario_id) REFERENCES Questionarios (questionario_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Vagas ADD FOREIGN KEY (recrutador_id) REFERENCES Recrutadores (recrutador_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Vagas ADD FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Vagas ADD FOREIGN KEY (cargo_id) REFERENCES Cargos (cargo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Vagas ADD FOREIGN KEY (senioridade_id) REFERENCES Senioridades (senioridade_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Vagas ADD FOREIGN KEY (modalidade_id) REFERENCES Modalidades (modalidade_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Curriculo ADD FOREIGN KEY (candidato_id) REFERENCES Candidatos (candidato_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE ExperienciaCandidato ADD FOREIGN KEY (curriculo_id) REFERENCES Curriculo (curriculo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE ExperienciaCandidato ADD FOREIGN KEY (cargo_id) REFERENCES Cargos (cargo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE ExperienciaCandidato ADD FOREIGN KEY (senioridade_id) REFERENCES Senioridades (senioridade_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Escolaridade ADD FOREIGN KEY (curriculo_id) REFERENCES Curriculo (curriculo_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Candidatura ADD FOREIGN KEY (curriculo_id) REFERENCES Curriculo (curriculo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Candidatura ADD FOREIGN KEY (vaga_id) REFERENCES Vagas (vaga_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Skills_Curriculo ADD FOREIGN KEY (curriculo_id) REFERENCES Curriculo (curriculo_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Skills_Curriculo ADD FOREIGN KEY (skill_id) REFERENCES Skills (skill_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Skills_Vaga ADD FOREIGN KEY (vaga_id) REFERENCES Vagas (vaga_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Skills_Vaga ADD FOREIGN KEY (skill_id) REFERENCES Skills (skill_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Badges_Candidato ADD FOREIGN KEY (badge_id) REFERENCES Badges (badge_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE Badges_Candidato ADD FOREIGN KEY (candidato_id) REFERENCES Candidatos (candidato_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE MetasESG ADD FOREIGN KEY (empresa_id) REFERENCES Empresa (empresa_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE MetasESG ADD FOREIGN KEY (badge_id) REFERENCES Badges (badge_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Contratacao ADD FOREIGN KEY (candidatura_id) REFERENCES Candidatura (candidatura_id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE AderenciaMetasESG ADD FOREIGN KEY (contratacao_id) REFERENCES Contratacao (contratacao_id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE AderenciaMetasESG ADD FOREIGN KEY (meta_id) REFERENCES MetasESG (meta_id) DEFERRABLE INITIALLY IMMEDIATE;