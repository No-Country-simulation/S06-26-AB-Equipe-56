const CandidatoModel = require('../models/CandidatoModel');
const VagaModel = require('../models/VagaModel');
const EmpresaModel = require('../models/EmpresaModel');

async function startMcpTools() {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { z } = await import('zod');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');

  const server = new McpServer({ name: 'rh-server', version: '1.0.0' });

  const formatarResposta = (dados) => ({
    content: [{ type: 'text', text: JSON.stringify(dados, null, 2) }]
  });

  server.tool(
    'consultar_candidato',
    'Consulta o perfil completo do candidato pela view vw_perfil_completo_candidato',
    {
      candidato_id: z.number().int().positive().describe('ID do candidato')
    },
    async ({ candidato_id }) => {
      if (!Number.isInteger(candidato_id) || candidato_id <= 0) {
        return {
          content: [{ type: 'text', text: 'Informe um candidato_id válido.' }]
        };
      }

      const candidato = await CandidatoModel.buscar_perfil_completo_para_score(candidato_id);
      if (!candidato) {
        return {
          content: [{ type: 'text', text: 'Candidato não encontrado.' }]
        };
      }

      return formatarResposta(candidato);
    }
  );

  server.tool(
    'consultar_vaga',
    'Consulta os detalhes de uma vaga pela view vw_detalhes_vaga',
    {
      vaga_id: z.number().int().positive().describe('ID da vaga'),
      empresa_id: z.number().int().positive().describe('ID da empresa da vaga')
    },
    async ({ vaga_id, empresa_id }) => {
      if (!Number.isInteger(vaga_id) || vaga_id <= 0 || !Number.isInteger(empresa_id) || empresa_id <= 0) {
        return {
          content: [{ type: 'text', text: 'Informe vaga_id e empresa_id válidos.' }]
        };
      }

      const vaga = await VagaModel.buscarVagaPorId(vaga_id, empresa_id);
      if (!vaga) {
        return {
          content: [{ type: 'text', text: 'Vaga não encontrada para esta empresa.' }]
        };
      }

      return formatarResposta(vaga);
    }
  );

  server.tool(
    'consultar_metas_empresa',
    'Consulta as metas ESG da empresa pela view vw_metas_empresa',
    {
      empresa_id: z.number().int().positive().describe('ID da empresa')
    },
    async ({ empresa_id }) => {
      if (!Number.isInteger(empresa_id) || empresa_id <= 0) {
        return {
          content: [{ type: 'text', text: 'Informe um empresa_id válido.' }]
        };
      }

      const metas = await EmpresaModel.buscarMetasPorEmpresa(empresa_id);
      if (!metas) {
        return {
          content: [{ type: 'text', text: 'Nenhuma meta encontrada para esta empresa.' }]
        };
      }

      return formatarResposta(metas);
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP tools registrados e conectados via STDIO.');
  return server;
}

startMcpTools().catch(err => {
  console.error('Erro ao iniciar MCP tools:', err);
  process.exit(1);
});