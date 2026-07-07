const ModalidadeModel = require('../models/ModalidadeModel');

const listarModalidades = async (req, res) => {
    try {
        const modalidades = await ModalidadeModel.listarTodos();
        res.status(200).json(modalidades);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar modalidades.' });
    }
};

const buscarModalidadePorId = async (req, res) => {
    try {
        const modalidade = await ModalidadeModel.buscarPorId(req.params.id);
        if (!modalidade) {
            return res.status(404).json({ mensagem: 'Modalidade não encontrada.' });
        }
        res.status(200).json(modalidade);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar modalidade.' });
    }
};

const criarModalidade = async (req, res) => {
    try {
        const novaModalidade = await ModalidadeModel.criar(req.body);
        res.status(201).json(novaModalidade);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar modalidade.' });
    }
};

module.exports = { listarModalidades, buscarModalidadePorId, criarModalidade };
