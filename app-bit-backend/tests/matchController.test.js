const test = require('node:test');
const assert = require('node:assert/strict');
const { processarMatch } = require('../src/controllers/MatchController');

test('processarMatch normaliza o retorno para o formato do endpoint', async () => {
  const req = {
    body: {
      empresa_id: 10,
      vaga: {
        titulo: 'Desenvolvedor Backend',
        skills: ['Node.js', 'PostgreSQL'],
        nivel: 'Pleno',
        regiao: 'Remoto'
      },
      filtros: {
        anti_vies: true,
        diversidade_minima: 1
      },
      candidatos: [
        {
          candidato_id: 5,
          nome: 'Ana Souza',
          score_match: 91,
          badge_diversidade: ['mulher', 'pcd'],
          skills: ['Node.js', 'PostgreSQL'],
          lat: -23.5489,
          lng: -46.6388
        }
      ],
      total_analisados: 1,
      diversidade_resultado: {
        impacto_meta_esg: 'Aumenta a representação feminina.'
      }
    }
  };

  let response;
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      response = data;
    }
  };

  await processarMatch(req, res);

  assert.equal(res.statusCode, 200);
  assert.ok(response);
  assert.equal(response.total_analisados, 1);
  assert.equal(response.candidatos[0].candidato_id, 5);
  assert.equal(response.candidatos[0].nome, 'Ana Souza');
  assert.equal(response.candidatos[0].score_match, 91);
  assert.deepEqual(response.candidatos[0].badge_diversidade, ['mulher', 'pcd']);
  assert.deepEqual(response.candidatos[0].skills, ['Node.js', 'PostgreSQL']);
  assert.equal(response.diversidade_resultado.impacto_meta_esg, 'Aumenta a representação feminina.');
});
