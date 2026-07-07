const SenioridadeModel = require('../models/SenioridadeModel');

const listarSenioridades = async (req, res) => {
    try {
        const senioridades = await SenioridadeModel.listarTodos();
        res.status(200).json(senioridades);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar senioridades.' });
    }
};

const buscarSenioridadePorId = async (req, res) => {
    try {
        const senioridade = await SenioridadeModel.buscarPorId(req.params.id);
        if (!senioridade) {
            return res.status(404).json({ mensagem: 'Senioridade não encontrada.' });
        }
        res.status(200).json(senioridade);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar senioridade.' });
    }
};

const criarSenioridade = async (req, res) => {
    try {
        const novaSenioridade = await SenioridadeModel.criar(req.body);
        res.status(201).json(novaSenioridade);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar senioridade.' });
    }
};

module.exports = { listarSenioridades, buscarSenioridadePorId, criarSenioridade };
