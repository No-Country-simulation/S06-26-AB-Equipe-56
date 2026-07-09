const test = require('node:test');
const assert = require('node:assert/strict');

const VagaModel = require('../src/models/VagaModel');
const { registerMcpTools } = require('../src/mcp/tools');

test('consultar_vaga retorna uma vaga de exemplo via MCP', async () => {
  const registered = [];
  const fakeServer = {
    tool: (name, description, schema, handler) => {
      registered.push({ name, description, schema, handler });
    },
    prompt: () => {},
    connect: async () => {}
  };

  const originalBuscarVagaPorId = VagaModel.buscarVagaPorId;
  VagaModel.buscarVagaPorId = async () => ({
    vaga_id: 42,
    titulo: 'Desenvolvedor Back-end',
    descricao: 'Vaga de exemplo para teste de MCP',
    cargo: 'Desenvolvedor',
    senioridade: 'Pleno',
    modalidade: 'Remoto'
  });

  try {
    await registerMcpTools(fakeServer);

    const vagaTool = registered.find((item) => item.name === 'consultar_vaga');
    assert.ok(vagaTool, 'A ferramenta consultar_vaga não foi registrada');

    const resultado = await vagaTool.handler({ vaga_id: 42, empresa_id: 7 });
    assert.ok(resultado?.content?.[0]?.text, 'A resposta MCP não retornou texto');

    const payload = JSON.parse(resultado.content[0].text);
    assert.equal(payload.vaga_id, 42);
    assert.equal(payload.titulo, 'Desenvolvedor Back-end');
    assert.equal(payload.modalidade, 'Remoto');
  } finally {
    VagaModel.buscarVagaPorId = originalBuscarVagaPorId;
  }
});
