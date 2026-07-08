const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'rafa7887',
  host: 'localhost',
  port: 5433,
  database: 'HackatonNoCountry'
});

async function main() {
  const sqlPath = path.join(__dirname, '..', '..', 'sql', 'views.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !s.startsWith('--'));

  for (const statement of statements) {
    await pool.query(statement);
  }

  const res = await pool.query("SELECT table_name FROM information_schema.views WHERE table_schema = 'public' ORDER BY table_name");
  console.log('Views criadas:', res.rows.map((row) => row.table_name).join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => pool.end());
