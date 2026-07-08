const processarMatch = async (req, res) => {
  try {
    const { empresa_id, vaga, filtros, candidatos, total_analisados, diversidade_resultado } = req.body || {};

    if (!empresa_id || !vaga) {
      return res.status(400).json({ mensagem: 'empresa_id e vaga são obrigatórios.' });
    }

    const candidatosNormalizados = Array.isArray(candidatos) ? candidatos.map((candidato) => ({
      candidato_id: candidato?.candidato_id ?? null,
      nome: candidato?.nome ?? 'Sem nome',
      score_match: typeof candidato?.score_match === 'number' ? candidato.score_match : 0,
      badge_diversidade: Array.isArray(candidato?.badge_diversidade) ? candidato.badge_diversidade : [],
      skills: Array.isArray(candidato?.skills) ? candidato.skills : [],
      lat: typeof candidato?.lat === 'number' ? candidato.lat : null,
      lng: typeof candidato?.lng === 'number' ? candidato.lng : null
    })) : [];

    const resposta = {
      candidatos: candidatosNormalizados,
      total_analisados: Number.isInteger(total_analisados) ? total_analisados : candidatosNormalizados.length,
      diversidade_resultado: diversidade_resultado || {
        impacto_meta_esg: 'Análise de diversidade concluída com base no payload recebido.'
      }
    };

    return res.status(200).json(resposta);
  } catch (erro) {
    console.error('Erro ao processar match:', erro);
    return res.status(500).json({ mensagem: 'Erro ao processar o match.' });
  }
};

module.exports = { processarMatch };