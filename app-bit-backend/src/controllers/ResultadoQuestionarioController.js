const ResultadoQuestionarioModel = require('../models/ResultadoQuestionarioModel');

const listarResultadosPorRecrutador = async (req, res) => {
    try {
        const resultados = await ResultadoQuestionarioModel.listarPorRecrutador(req.params.recrutadorId);
        res.status(200).json(resultados);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar resultados do recrutador.' });
    }
};

const criarResultado = async (req, res) => {
    try {
        const novoResultado = await ResultadoQuestionarioModel.criar(req.body);
        res.status(201).json(novoResultado);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao salvar resultado.' });
    }
};

module.exports = { listarResultadosPorRecrutador, criarResultado };
