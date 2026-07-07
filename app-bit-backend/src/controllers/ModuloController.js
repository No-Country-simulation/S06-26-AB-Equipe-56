const ModuloModel = require('../models/ModuloModel');

const listarModulos = async (req, res) => {
    try {
        const modulos = await ModuloModel.listarTodos();
        res.status(200).json(modulos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar módulos.' });
    }
};

const listarModulosPorTrilha = async (req, res) => {
    try {
        const modulos = await ModuloModel.listarPorTrilha(req.params.trilhaId);
        res.status(200).json(modulos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar módulos da trilha.' });
    }
};

const buscarModuloPorId = async (req, res) => {
    try {
        const modulo = await ModuloModel.buscarPorId(req.params.id);
        if (!modulo) {
            return res.status(404).json({ mensagem: 'Módulo não encontrado.' });
        }
        res.status(200).json(modulo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar módulo.' });
    }
};

const criarModulo = async (req, res) => {
    try {
        const novoModulo = await ModuloModel.criar(req.body);
        res.status(201).json(novoModulo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar módulo.' });
    }
};

module.exports = { listarModulos, listarModulosPorTrilha, buscarModuloPorId, criarModulo };
