const CandidatoModel = require('../models/CandidatoModel');

const listarTodos = async (req, res) => {
    try {
        const lista = await CandidatoModel.listarTodos();
        res.status(200).json(lista);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar candidatos." });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const candidato = await CandidatoModel.buscarPorId(req.params.id);
        if (!candidato) return res.status(404).json({ mensagem: "Candidato não encontrado." });
        res.status(200).json(candidato);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar candidato." });
    }
};

const criar = async (req, res) => {
    try {
        const { nome, email, senha, telefone, cpf } = req.body;
        const novoCandidato = await CandidatoModel.criar({ nome, email, senha, telefone, cpf });
        res.status(201).json(novoCandidato);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: "Erro ao criar candidato." });
    }
};

module.exports = { listarTodos, buscarPorId, criar };
