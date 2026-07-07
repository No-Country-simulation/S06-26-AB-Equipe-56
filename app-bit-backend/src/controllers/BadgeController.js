const BadgeModel = require('../models/BadgeModel');

const listarBadges = async (req, res) => {
    try {
        const badges = await BadgeModel.listarTodos();
        res.status(200).json(badges);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar badges.' });
    }
};

const buscarBadgePorId = async (req, res) => {
    try {
        const badge = await BadgeModel.buscarPorId(req.params.id);
        if (!badge) {
            return res.status(404).json({ mensagem: 'Badge não encontrado.' });
        }
        res.status(200).json(badge);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar badge.' });
    }
};

const criarBadge = async (req, res) => {
    try {
        const novoBadge = await BadgeModel.criar(req.body);
        res.status(201).json(novoBadge);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar badge.' });
    }
};

module.exports = { listarBadges, buscarBadgePorId, criarBadge };
