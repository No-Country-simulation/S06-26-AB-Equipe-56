const QuestionarioModel = require('../models/QuestionarioModel');

const listarQuestionarios = async (req, res) => {
    try {
        const questionarios = await QuestionarioModel.listarTodos();
        res.status(200).json(questionarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar questionários.' });
    }
};

const listarQuestionariosPorModulo = async (req, res) => {
    try {
        const questionarios = await QuestionarioModel.listarPorModulo(req.params.moduloId);
        res.status(200).json(questionarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar questionários do módulo.' });
    }
};

const buscarQuestionarioPorId = async (req, res) => {
    try {
        const questionario = await QuestionarioModel.buscarPorId(req.params.id);
        if (!questionario) {
            return res.status(404).json({ mensagem: 'Questionário não encontrado.' });
        }
        res.status(200).json(questionario);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar questionário.' });
    }
};

const criarQuestionario = async (req, res) => {
    try {
        const novoQuestionario = await QuestionarioModel.criar(req.body);
        res.status(201).json(novoQuestionario);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar questionário.' });
    }
};

module.exports = { listarQuestionarios, listarQuestionariosPorModulo, buscarQuestionarioPorId, criarQuestionario };
