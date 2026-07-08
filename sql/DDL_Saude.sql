-- ===========================================================
-- App BiT - Modelo de dados (PostgreSQL)
-- Módulo Saúde
-- ===========================================================

CREATE TABLE Especialidades (
  especialidade_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE ProfissionaisSaude (
  profissional_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  crm VARCHAR(50) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  especialidade_id INT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Pacientes (
  paciente_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE,
  telefone VARCHAR(20),
  altura NUMERIC(5,2),
  peso NUMERIC(5,2),
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Consultas (
  consulta_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paciente_id INT NOT NULL,
  profissional_id INT NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'agendada',
  observacoes TEXT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE Exames (
  exame_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  paciente_id INT NOT NULL,
  profissional_id INT NOT NULL,
  tipo_exame VARCHAR(255) NOT NULL,
  data_exame TIMESTAMP NOT NULL,
  resultado TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pendente',
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

-- ===========================================================
-- Foreign Keys
-- ===========================================================

ALTER TABLE ProfissionaisSaude
  ADD FOREIGN KEY (especialidade_id) REFERENCES Especialidades (especialidade_id)
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Consultas
  ADD FOREIGN KEY (paciente_id) REFERENCES Pacientes (paciente_id)
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Consultas
  ADD FOREIGN KEY (profissional_id) REFERENCES ProfissionaisSaude (profissional_id)
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Exames
  ADD FOREIGN KEY (paciente_id) REFERENCES Pacientes (paciente_id)
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Exames
  ADD FOREIGN KEY (profissional_id) REFERENCES ProfissionaisSaude (profissional_id)
  DEFERRABLE INITIALLY IMMEDIATE;
