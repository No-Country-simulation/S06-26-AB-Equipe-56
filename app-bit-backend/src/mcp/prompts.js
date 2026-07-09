async function registerPrompts(server) {
  const { z } = await import('zod');

  server.prompt(
    'analisar_candidato_para_vaga',
    'Guia o modelo a analisar o fit de um candidato para uma vaga usando as ferramentas e a norma técnica.',
    {
      candidato_id: z.number().int().positive().describe('ID do candidato'),
      vaga_id: z.number().int().positive().describe('ID da vaga'),
      empresa_id: z.number().int().positive().describe('ID da empresa')
    },
    async ({ candidato_id, vaga_id, empresa_id }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Você é o motor de scoring do App BiT. Use as ferramentas disponíveis para consultar o candidato, a vaga e as metas da empresa. Aplique a norma técnica disponível em rh://normas/tecnica-scoring.

Contexto:
- candidato_id: ${candidato_id}
- vaga_id: ${vaga_id}
- empresa_id: ${empresa_id}

Retorne um resumo executivo com:
1. Score final estimado de aderência;
2. Justificativa técnica e de diversidade/ESG;
3. Pontos fortes;
4. Oportunidades de melhoria;
5. Recomendação de contratação ou seguimento do processo.`
          }
        }
      ]
    })
  );
}

module.exports = {
  registerPrompts
};
