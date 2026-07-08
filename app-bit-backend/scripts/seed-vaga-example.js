const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function main() {
  await pool.query("INSERT INTO Cargos (nome) VALUES ('Desenvolvedor') ON CONFLICT DO NOTHING");
  await pool.query("INSERT INTO Senioridades (nome) VALUES ('Pleno') ON CONFLICT DO NOTHING");
  await pool.query("INSERT INTO Modalidades (nome) VALUES ('Remoto') ON CONFLICT DO NOTHING");

  await pool.query(
    "INSERT INTO Vagas (recrutador_id, empresa_id, titulo, descricao, cargo_id, senioridade_id, modalidade_id) VALUES (1, 1, 'Vaga de exemplo MCP', 'Vaga criada para teste do MCP', 1, 1, 1)"
  );

  const res = await pool.query('SELECT COUNT(*)::int AS total_vagas FROM Vagas');
  console.log(JSON.stringify(res.rows[0], null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => pool.end());
