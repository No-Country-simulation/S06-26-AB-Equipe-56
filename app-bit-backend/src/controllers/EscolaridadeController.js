const EscolaridadeModel = require('../models/EscolaridadeModel');

class EscolaridadeController {
    static async criarEscolaridade(req, res) {
        try {
            const novaEscolaridade = await EscolaridadeModel.criar(req.body);
            return res.status(201).json(novaEscolaridade);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar a escolaridade." });
        }
    }

    static async listarPorCurriculo(req, res) {
        try {
            const { curriculo_id } = req.params;
            const escolaridades = await EscolaridadeModel.listarPorCurriculo(curriculo_id);
            return res.status(200).json(escolaridades);
        } catch (erro) {
            return res.status(500).json({ erro: "Erro ao listar as escolaridades." });
        }
    }
}

module.exports = EscolaridadeController;