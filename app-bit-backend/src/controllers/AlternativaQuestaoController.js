const AlternativaQuestaoModel = require('../models/AlternativaQuestaoModel');

const listarAlternativasPorQuestao = async (req, res) => {
    try {
        const alternativas = await AlternativaQuestaoModel.listarPorQuestao(req.params.questaoId);
        res.status(200).json(alternativas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar alternativas.' });
    }
};

const buscarAlternativaPorId = async (req, res) => {
    try {
        const alternativa = await AlternativaQuestaoModel.buscarPorId(req.params.id);
        if (!alternativa) {
            return res.status(404).json({ mensagem: 'Alternativa não encontrada.' });
        }
        res.status(200).json(alternativa);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar alternativa.' });
    }
};

const criarAlternativa = async (req, res) => {
    try {
        const novaAlternativa = await AlternativaQuestaoModel.criar(req.body);
        res.status(201).json(novaAlternativa);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar alternativa.' });
    }
};

module.exports = { listarAlternativasPorQuestao, buscarAlternativaPorId, criarAlternativa };
