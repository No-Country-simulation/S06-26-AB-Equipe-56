const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function main() {
  const dbRes = await pool.query('SELECT current_database() AS db, current_schema() AS schema');
  console.log(JSON.stringify(dbRes.rows[0], null, 2));

  const viewsRes = await pool.query(
    "SELECT table_schema, table_name FROM information_schema.views WHERE table_name ILIKE 'vw_%' ORDER BY table_name"
  );
  console.log(JSON.stringify(viewsRes.rows, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => pool.end());
