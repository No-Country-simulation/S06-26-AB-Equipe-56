const EscolaridadeModel = require('../models/EscolaridadeModel');

const listarEscolaridadesPorCurriculo = async (req, res) => {
    try {
        const escolaridades = await EscolaridadeModel.listarPorCurriculo(req.params.curriculoId);
        res.status(200).json(escolaridades);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar escolaridades.' });
    }
};

const criarEscolaridade = async (req, res) => {
    try {
        const novaEscolaridade = await EscolaridadeModel.criar(req.body);
        res.status(201).json(novaEscolaridade);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar escolaridade.' });
    }
};

module.exports = { listarEscolaridadesPorCurriculo, criarEscolaridade };
