const ExperienciaCandidatoModel = require('../models/ExperienciaCandidatoModel');

const listarExperienciasPorCurriculo = async (req, res) => {
    try {
        const experiencias = await ExperienciaCandidatoModel.listarPorCurriculo(req.params.curriculoId);
        res.status(200).json(experiencias);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar experiências do candidato.' });
    }
};

const criarExperiencia = async (req, res) => {
    try {
        const novaExperiencia = await ExperienciaCandidatoModel.criar(req.body);
        res.status(201).json(novaExperiencia);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar experiência.' });
    }
};

module.exports = { listarExperienciasPorCurriculo, criarExperiencia };
