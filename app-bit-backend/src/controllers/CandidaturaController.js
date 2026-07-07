const CandidaturaModel = require('../models/CandidaturaModel');

const listarCandidaturas = async (req, res) => {
    try {
        const candidaturas = await CandidaturaModel.listarTodos();
        res.status(200).json(candidaturas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar candidaturas.' });
    }
};

const buscarCandidaturaPorId = async (req, res) => {
    try {
        const candidatura = await CandidaturaModel.buscarPorId(req.params.id);
        if (!candidatura) {
            return res.status(404).json({ mensagem: 'Candidatura não encontrada.' });
        }
        res.status(200).json(candidatura);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar candidatura.' });
    }
};

const listarCandidaturasPorCurriculo = async (req, res) => {
    try {
        const candidaturas = await CandidaturaModel.listarPorCurriculo(req.params.curriculoId);
        res.status(200).json(candidaturas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar candidaturas do currículo.' });
    }
};

const criarCandidatura = async (req, res) => {
    try {
        const novaCandidatura = await CandidaturaModel.criar(req.body);
        res.status(201).json(novaCandidatura);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar candidatura.' });
    }
};

module.exports = { listarCandidaturas, buscarCandidaturaPorId, listarCandidaturasPorCurriculo, criarCandidatura };
