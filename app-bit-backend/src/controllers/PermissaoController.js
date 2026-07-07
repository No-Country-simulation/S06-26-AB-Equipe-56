const PermissaoModel = require('../models/PermissaoModel');

const listarPermissoes = async (req, res) => {
    try {
        const permissoes = await PermissaoModel.listarTodos();
        res.status(200).json(permissoes);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar permissões.' });
    }
};

const buscarPermissaoPorId = async (req, res) => {
    try {
        const permissao = await PermissaoModel.buscarPorId(req.params.id);
        if (!permissao) {
            return res.status(404).json({ mensagem: 'Permissão não encontrada.' });
        }
        res.status(200).json(permissao);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar permissão.' });
    }
};

const criarPermissao = async (req, res) => {
    try {
        const novaPermissao = await PermissaoModel.criar(req.body);
        res.status(201).json(novaPermissao);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar permissão.' });
    }
};

module.exports = { listarPermissoes, buscarPermissaoPorId, criarPermissao };
