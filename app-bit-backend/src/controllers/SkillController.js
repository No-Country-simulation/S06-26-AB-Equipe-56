const SkillModel = require('../models/SkillModel');

const listarSkills = async (req, res) => {
    try {
        const skills = await SkillModel.listarTodos();
        res.status(200).json(skills);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar skills.' });
    }
};

const buscarSkillPorId = async (req, res) => {
    try {
        const skill = await SkillModel.buscarPorId(req.params.id);
        if (!skill) {
            return res.status(404).json({ mensagem: 'Skill não encontrada.' });
        }
        res.status(200).json(skill);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar skill.' });
    }
};

const criarSkill = async (req, res) => {
    try {
        const novaSkill = await SkillModel.criar(req.body);
        res.status(201).json(novaSkill);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar skill.' });
    }
};

module.exports = { listarSkills, buscarSkillPorId, criarSkill };
