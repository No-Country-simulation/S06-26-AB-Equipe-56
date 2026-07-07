const MetaESGModel = require('../models/MetaESGModel');

const listarMetasPorEmpresa = async (req, res) => {
    try {
        const metas = await MetaESGModel.listarPorEmpresa(req.params.empresaId);
        res.status(200).json(metas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar metas ESG.' });
    }
};

const criarMetaESG = async (req, res) => {
    try {
        const novaMeta = await MetaESGModel.criar(req.body);
        res.status(201).json(novaMeta);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar meta ESG.' });
    }
};

module.exports = { listarMetasPorEmpresa, criarMetaESG };
