const RecrutadorModel = require('../models/RecrutadorModel');

const listarTodos = async (req, res) => {
    try {
        const lista = await RecrutadorModel.listarTodos();
        res.status(200).json(lista);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar recrutadores." });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const recrutador = await RecrutadorModel.buscarPorId(req.params.id);
        if (!recrutador) return res.status(404).json({ mensagem: "Recrutador não encontrado." });
        res.status(200).json(recrutador);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar recrutador." });
    }
};

const criar = async (req, res) => {
    try {
        const { nome, email, senha, empresa_id, permissao_id } = req.body;
        const novo = await RecrutadorModel.criar({ nome, email, senha, empresa_id, permissao_id });
        
        res.status(201).json(novo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: "Erro ao criar recrutador." });
    }
};
module.exports = { listarTodos, buscarPorId, criar };