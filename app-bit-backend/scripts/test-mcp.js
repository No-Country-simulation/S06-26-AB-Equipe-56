const path = require('path');
const { Pool } = require('pg');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  });

  const vagaResult = await pool.query('SELECT vaga_id, empresa_id FROM Vagas ORDER BY vaga_id LIMIT 1');
  const vaga = vagaResult.rows[0];
  await pool.end();

  if (!vaga) {
    throw new Error('Nenhuma vaga encontrada no banco atual.');
  }

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(process.cwd(), 'src/mcp/tools.js')],
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });

  const client = new Client({ name: 'mcp-cli-test', version: '1.0.0' });
  await client.connect(transport);

  const result = await client.callTool({
    name: 'consultar_vaga',
    arguments: { vaga_id: vaga.vaga_id, empresa_id: vaga.empresa_id },
  });

  console.log(JSON.stringify(result, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
