const CurriculoModel = require('../models/CurriculoModel');

const listarCurriculos = async (req, res) => {
    try {
        const curriculos = await CurriculoModel.listarTodos();
        res.status(200).json(curriculos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar currículos.' });
    }
};

const buscarCurriculoPorId = async (req, res) => {
    try {
        const curriculo = await CurriculoModel.buscarPorId(req.params.id);
        if (!curriculo) {
            return res.status(404).json({ mensagem: 'Currículo não encontrado.' });
        }
        res.status(200).json(curriculo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar currículo.' });
    }
};

const listarCurriculosPorCandidato = async (req, res) => {
    try {
        const curriculos = await CurriculoModel.buscarPorCandidato(req.params.candidatoId);
        res.status(200).json(curriculos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar currículos do candidato.' });
    }
};

const criarCurriculo = async (req, res) => {
    try {
        const novoCurriculo = await CurriculoModel.criar(req.body);
        res.status(201).json(novoCurriculo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar currículo.' });
    }
};

module.exports = { listarCurriculos, buscarCurriculoPorId, listarCurriculosPorCandidato, criarCurriculo };
