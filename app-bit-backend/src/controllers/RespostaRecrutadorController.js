const RespostaRecrutadorModel = require('../models/RespostaRecrutadorModel');

const listarRespostasPorRecrutador = async (req, res) => {
    try {
        const respostas = await RespostaRecrutadorModel.listarPorRecrutador(req.params.recrutadorId);
        res.status(200).json(respostas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar respostas do recrutador.' });
    }
};

const criarResposta = async (req, res) => {
    try {
        const novaResposta = await RespostaRecrutadorModel.criar(req.body);
        res.status(201).json(novaResposta);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao salvar resposta.' });
    }
};

module.exports = { listarRespostasPorRecrutador, criarResposta };
