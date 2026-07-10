const MentoriaModel = require('../models/mentoria.model');

const listarMentores = (req, res) => {
  res.json({ mentores: MentoriaModel.mentores });
};

const solicitarMentoria = (req, res) => {
  const { mentor_id, desafio_atual } = req.body;

  if (!mentor_id || !desafio_atual) {
    return res.status(400).json({ erro: "Dados incompletos para o Match de mentoria." });
  }

  const novaSolicitacao = {
    id: `match_${Date.now()}`,
    mentor_id,
    desafio_atual,
    status: "PENDENTE",
    data: new Date().toISOString()
  };

  MentoriaModel.solicitacoesMentoria.push(novaSolicitacao);
  
  res.status(201).json({
    mensagem: "Conexão de mentoria solicitada com sucesso!",
    match_score: 92,
    solicitacao: novaSolicitacao
  });
};

module.exports = { 
  listarMentores, 
  solicitarMentoria 
};