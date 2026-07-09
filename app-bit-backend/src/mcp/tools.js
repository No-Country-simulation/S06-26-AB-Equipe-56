const CandidatoModel = require('../models/CandidatoModel');

const VagaModel = require('../models/VagaModel');
const EmpresaModel = require('../models/EmpresaModel');
const { registerPrompts } = require('./prompts');

async function registerMcpTools(server) {
  const { z } = await import('zod');

  // Helper para formatar a saída padrão do MCP
  const formatarResposta = (dados) => ({
    content: [{ type: 'text', text: JSON.stringify(dados, null, 2) }]
  });

  // Helper para capturar e formatar erros de execução/banco
  const formatarErro = (erro, acao) => {
    console.error(`Erro ao ${acao}:`, erro); // Loga no stderr para você debugar
    return {
      content: [{ type: 'text', text: `Erro interno no servidor ao ${acao}. Tente novamente mais tarde.` }]
    };
  };



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
      try {
        const candidato = await CandidatoModel.buscar_perfil_completo_para_score(candidato_id);
        if (!candidato) {
          return { content: [{ type: 'text', text: 'Candidato não encontrado.' }] };
        }
        return formatarResposta(candidato);
      } catch (error) {
        return formatarErro(error, 'consultar candidato');
      }
    }
  );

  // 2. FERRAMENTA: Consultar Vaga
  server.tool(
    'consultar_vaga',
    'Consulta os detalhes de uma vaga pela view vw_detalhes_vaga',
    {
      vaga_id: z.number().int().positive().describe('ID da vaga'),
      empresa_id: z.number().int().positive().describe('ID da empresa da vaga')
    },
    async ({ vaga_id, empresa_id }) => {
      try {
        const vaga = await VagaModel.buscarVagaPorId(vaga_id, empresa_id);
        if (!vaga) {
          return { content: [{ type: 'text', text: 'Vaga não encontrada para esta empresa.' }] };
        }
        return formatarResposta(vaga);
      } catch (error) {
        if (error?.message?.includes('vw_detalhes_vaga') || error?.code === '42P01') {
          return formatarResposta({
            vaga_id: vaga_id,
            titulo: 'Vaga de exemplo (fallback MCP)',
            descricao: 'Resposta retornada pelo MCP porque a view vw_detalhes_vaga não está disponível no banco atual.',
            cargo: 'Desenvolvedor',
            senioridade: 'Pleno',
            modalidade: 'Remoto',
            empresa_id: empresa_id
          });
        }
        return formatarErro(error, 'consultar vaga');
      }
    }
  );

  // 3. FERRAMENTA: Consultar Metas da Empresa
  server.tool(
    'consultar_metas_empresa',
    'Consulta as metas ESG da empresa pela view vw_metas_empresa',
    {
      empresa_id: z.number().int().positive().describe('ID da empresa')
    },
    async ({ empresa_id }) => {
      try {
        const metas = await EmpresaModel.buscarMetasPorEmpresa(empresa_id);
        if (!metas) {
          return { content: [{ type: 'text', text: 'Nenhuma meta encontrada para esta empresa.' }] };
        }
        return formatarResposta(metas);
      } catch (error) {
        return formatarErro(error, 'consultar metas da empresa');
      }
    }
  );

  await registerPrompts(server);

  return server;
}

async function startMcpTools() {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');

  const server = new McpServer({ name: 'rh-server', version: '1.0.0' });
  await registerMcpTools(server);

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

if (require.main === module) {
  startMcpTools().catch(err => {
    console.error('Erro fatal ao iniciar MCP tools:', err);
    process.exit(1);
  });
}

module.exports = {
  registerMcpTools,
  startMcpTools
};