const TrilhaModel = require('../models/TrilhaModel');

const listarTrilhas = async (req, res) => {
    try {
        const trilhas = await TrilhaModel.listarTodos();
        res.status(200).json(trilhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar trilhas.' });
    }
};

const listarTrilhasAtivas = async (req, res) => {
    try {
        const trilhas = await TrilhaModel.listarAtivas();
        res.status(200).json(trilhas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar trilhas ativas.' });
    }
};

const buscarTrilhaPorId = async (req, res) => {
    try {
        const trilha = await TrilhaModel.buscarPorId(req.params.id);
        if (!trilha) {
            return res.status(404).json({ mensagem: 'Trilha não encontrada.' });
        }
        res.status(200).json(trilha);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar trilha.' });
    }
};

const criarTrilha = async (req, res) => {
    try {
        const novaTrilha = await TrilhaModel.criar(req.body);
        res.status(201).json(novaTrilha);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar trilha.' });
    }
};

module.exports = { listarTrilhas, listarTrilhasAtivas, buscarTrilhaPorId, criarTrilha };
