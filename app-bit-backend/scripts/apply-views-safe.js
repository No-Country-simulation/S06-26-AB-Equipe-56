const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
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
    try {
      await pool.query(statement);
    } catch (err) {
      const message = String(err.message || '');
      if (!message.includes('already exists') && !message.includes('does not exist')) {
        throw err;
      }
    }
  }

  const res = await pool.query("SELECT table_name FROM information_schema.views WHERE table_schema = 'public' ORDER BY table_name");
  console.log(JSON.stringify(res.rows, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => pool.end());
