const CandidatoModel = require('../models/CandidatoModel');

async function startMcpTools() {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { z } = await import('zod'); // 1. Importa o Zod dinamicamente também

  const server = new McpServer({ name: 'rh-server', version: '1.0.0' });

  server.tool(
    'consultar_candidato',
    'Consulta candidato por ID',
    {
      // 2. CORREÇÃO AQUI: Usando o Zod para o parâmetro numérico
      candidato_id: z.number().describe('ID do candidato')
    },
    async ({ candidato_id }) => {
      if (!candidato_id) {
        return {
          content: [{ type: 'text', text: 'Informe o candidato_id para consultar o candidato.' }]
        };
      }

      const candidato = await CandidatoModel.buscarPorId(1);
      if (!candidato) {
        return {
          content: [{ type: 'text', text: 'Candidato não encontrado.' }]
        };
      }

      // 3. CORREÇÃO AQUI: O MCP prefere o envio como string JSON dentro do formato de texto
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify(candidato, null, 2) 
        }]
      };
    }
  );

  // O transporte oficial do MCP para conectar com CLIs geralmente é via STDIO.
  // Como o McpServer do SDK moderno se conecta usando transportes, vamos garantir que ele ligue.
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP tool "consultar_candidato" registrada e conectada via STDIO.');
  return server;
}

startMcpTools().catch(err => {
  console.error('Erro ao iniciar MCP tools:', err);
  process.exit(1);
});