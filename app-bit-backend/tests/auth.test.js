const test = require('node:test');
const assert = require('node:assert/strict');
const { criarPayloadAutenticacao } = require('../src/controllers/AuthController');

test('cria payload com dados de saúde para profissional', () => {
  const payload = criarPayloadAutenticacao({
    tipo: 'profissional',
    id: 7,
    nome: 'Dra. Ana',
    email: 'ana@saude.com',
    especialidade_id: 2,
    crm: 'CRM-123',
    ativo: true,
    modulo: 'saude'
  });

  assert.deepEqual(payload, {
    id: 7,
    tipo: 'profissional',
    nome: 'Dra. Ana',
    email: 'ana@saude.com',
    modulo: 'saude',
    profissional_id: 7,
    especialidade_id: 2,
    crm: 'CRM-123',
    ativo: true
  });
});

test('cria payload com dados de saúde para paciente', () => {
  const payload = criarPayloadAutenticacao({
    tipo: 'paciente',
    id: 12,
    nome: 'Maria Silva',
    email: 'maria@saude.com',
    cpf: '123.456.789-00',
    data_nascimento: '1990-01-01',
    altura: 1.68,
    peso: 62.5,
    modulo: 'saude'
  });

  assert.deepEqual(payload, {
    id: 12,
    tipo: 'paciente',
    nome: 'Maria Silva',
    email: 'maria@saude.com',
    modulo: 'saude',
    paciente_id: 12,
    cpf: '123.456.789-00',
    data_nascimento: '1990-01-01',
    altura: 1.68,
    peso: 62.5
  });
});