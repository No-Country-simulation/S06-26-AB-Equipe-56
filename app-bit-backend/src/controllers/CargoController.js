const CargoModel = require('../models/CargoModel');

const listarCargos = async (req, res) => {
    try {
        const cargos = await CargoModel.listarTodos();
        res.status(200).json(cargos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar cargos.' });
    }
};

const buscarCargoPorId = async (req, res) => {
    try {
        const cargo = await CargoModel.buscarPorId(req.params.id);
        if (!cargo) {
            return res.status(404).json({ mensagem: 'Cargo não encontrado.' });
        }
        res.status(200).json(cargo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar cargo.' });
    }
};

const criarCargo = async (req, res) => {
    try {
        const novoCargo = await CargoModel.criar(req.body);
        res.status(201).json(novoCargo);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar cargo.' });
    }
};

module.exports = { listarCargos, buscarCargoPorId, criarCargo };
