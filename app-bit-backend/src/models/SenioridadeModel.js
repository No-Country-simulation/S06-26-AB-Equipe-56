const { conectarBanco } = require('../config/db_postgre');

class SenioridadeModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Senioridades ORDER BY senioridade_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar senioridades:', erro);
            throw erro;
        }
    }

    static async buscarPorId(senioridade_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Senioridades WHERE senioridade_id = $1', [senioridade_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar senioridade por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('INSERT INTO Senioridades (nome) VALUES ($1) RETURNING *', [dados.nome]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar senioridade:', erro);
            throw erro;
        }
    }
}

module.exports = SenioridadeModel;
