const SenioridadesModel = require('../models/SenioridadesModel');

class SenioridadesController {
    static async criarSenioridade(req, res) {
        try {
            const novaSenioridade = await SenioridadesModel.criar(req.body);
            return res.status(201).json(novaSenioridade);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao criar a senioridade." });
        }
    }

    static async listarSenioridades(req, res) {
        try {
            const senioridades = await SenioridadesModel.listarTodos();
            return res.status(200).json(senioridades);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao listar as senioridades." });
        }
    }
}

module.exports = SenioridadesController;