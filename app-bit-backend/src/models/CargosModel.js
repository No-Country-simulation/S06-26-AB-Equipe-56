/*
const CargosModel = require('../models/CargosModel');

class CargosController {
    static async criarCargo(req, res) {
        try {
            const dados = req.body;
            // Aqui você usa a classe que foi importada pelo require
            const novoCargo = await CargosModel.criar(dados); 
            
            res.status(201).json(novoCargo);
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao criar o cargo" });
        }
    }
}

module.exports = CargosController;*/
const { conectarBanco, sql } = require('../config/db');

class CargosModel {
    // Método para criar um novo cargo
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const resultado = await pool.request()
                .input('nome', sql.VarChar(255), dados.nome)
                .query(`
                    INSERT INTO Cargos (nome)
                    OUTPUT INSERTED.cargo_id, INSERTED.nome
                    VALUES (@nome)
                `);

            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao criar cargo na base de dados:", erro);
            throw erro;
        }
    }

    // Método para listar todos os cargos (útil para preencher dropdowns/selects no frontend)
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .query(`
                    SELECT 
                        cargo_id, 
                        nome
                    FROM Cargos 
                    ORDER BY nome ASC
                `);
            
            return resultado.recordset;
        } catch (erro) {
            console.error("Erro ao listar cargos na base de dados:", erro);
            throw erro;
        }
    }

    // Método opcional: Buscar um cargo específico por ID
    static async buscarPorId(cargo_id) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('cargo_id', sql.Int, cargo_id)
                .query(`
                    SELECT cargo_id, nome
                    FROM Cargos 
                    WHERE cargo_id = @cargo_id
                `);
            
            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao buscar cargo na base de dados:", erro);
            throw erro;
        }
    }
}

module.exports = CargosModel;