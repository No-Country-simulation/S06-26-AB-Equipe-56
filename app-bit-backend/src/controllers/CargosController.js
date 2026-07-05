const CargosModel = require('../models/CargosModel');

class CargosController {
    static async criarCargo(req, res) {
        try {
            const novoCargo = await CargosModel.criar(req.body);
            return res.status(201).json(novoCargo);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao criar o cargo." });
        }
    }

    static async listarCargos(req, res) {
        try {
            const cargos = await CargosModel.listarTodos();
            return res.status(200).json(cargos);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao listar os cargos." });
        }
    }
}

module.exports = CargosController;