const { conectarBanco } = require('../config/db_postgre');

class CargoModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Cargos ORDER BY cargo_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar cargos:', erro);
            throw erro;
        }
    }

    static async buscarPorId(cargo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Cargos WHERE cargo_id = $1', [cargo_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar cargo por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('INSERT INTO Cargos (nome) VALUES ($1) RETURNING *', [dados.nome]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar cargo:', erro);
            throw erro;
        }
    }
}

module.exports = CargoModel;
