const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

const queries = [
  "CREATE TABLE IF NOT EXISTS Cargos (cargo_id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL)",
  "CREATE TABLE IF NOT EXISTS Senioridades (senioridade_id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL)",
  "CREATE TABLE IF NOT EXISTS Modalidades (modalidade_id SERIAL PRIMARY KEY, nome VARCHAR(50) NOT NULL)",
  "CREATE TABLE IF NOT EXISTS Vagas (vaga_id SERIAL PRIMARY KEY, recrutador_id INT NOT NULL, empresa_id INT NOT NULL, titulo VARCHAR(255) NOT NULL, descricao TEXT, cargo_id INT NOT NULL, senioridade_id INT NOT NULL, modalidade_id INT NOT NULL, data_cadastro TIMESTAMP NOT NULL DEFAULT now())",
  "CREATE TABLE IF NOT EXISTS Candidatos (candidato_id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL, telefone VARCHAR(20), cpf VARCHAR(14) UNIQUE NOT NULL, data_cadastro TIMESTAMP NOT NULL DEFAULT now())",
  "CREATE TABLE IF NOT EXISTS Curriculo (curriculo_id SERIAL PRIMARY KEY, candidato_id INT NOT NULL, data_cadastro TIMESTAMP NOT NULL DEFAULT now())",
  "CREATE TABLE IF NOT EXISTS Skills (skill_id SERIAL PRIMARY KEY, tipo_skill VARCHAR(100) NOT NULL, nome_skill VARCHAR(255) NOT NULL)",
  "CREATE TABLE IF NOT EXISTS Skills_Vaga (skill_vaga_id SERIAL PRIMARY KEY, skill_id INT NOT NULL, vaga_id INT NOT NULL, nivel_skill VARCHAR(50) NOT NULL, obrigatorio BOOLEAN NOT NULL DEFAULT false, peso NUMERIC(5,2) NOT NULL DEFAULT 1)",
  "CREATE TABLE IF NOT EXISTS Endereco_Candidato (endereco_id SERIAL PRIMARY KEY, candidato_id INT NOT NULL, cep VARCHAR(10) NOT NULL, logradouro VARCHAR(255) NOT NULL, numero VARCHAR(20), complemento VARCHAR(100), bairro VARCHAR(100), cidade VARCHAR(100) NOT NULL, estado CHAR(2) NOT NULL, pais VARCHAR(50) DEFAULT 'Brasil', latitude NUMERIC(10, 8), longitude NUMERIC(11, 8), geohash VARCHAR(20), is_atual BOOLEAN DEFAULT TRUE, data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
];

async function main() {
  for (const query of queries) {
    await pool.query(query);
  }
  console.log('Tabelas mínimas criadas');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => pool.end());
