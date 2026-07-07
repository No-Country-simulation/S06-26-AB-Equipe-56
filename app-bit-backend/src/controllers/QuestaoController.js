const QuestaoModel = require('../models/QuestaoModel');

const listarQuestoes = async (req, res) => {
    try {
        const questoes = await QuestaoModel.listarTodos();
        res.status(200).json(questoes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar questões.' });
    }
};

const listarQuestoesPorQuestionario = async (req, res) => {
    try {
        const questoes = await QuestaoModel.listarPorQuestionario(req.params.questionarioId);
        res.status(200).json(questoes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar questões do questionário.' });
    }
};

const buscarQuestaoPorId = async (req, res) => {
    try {
        const questao = await QuestaoModel.buscarPorId(req.params.id);
        if (!questao) {
            return res.status(404).json({ mensagem: 'Questão não encontrada.' });
        }
        res.status(200).json(questao);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar questão.' });
    }
};

const criarQuestao = async (req, res) => {
    try {
        const novaQuestao = await QuestaoModel.criar(req.body);
        res.status(201).json(novaQuestao);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar questão.' });
    }
};

module.exports = { listarQuestoes, listarQuestoesPorQuestionario, buscarQuestaoPorId, criarQuestao };
