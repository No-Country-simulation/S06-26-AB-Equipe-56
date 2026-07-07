const { conectarBanco } = require('../config/db_postgre');

class ModalidadeModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Modalidades ORDER BY modalidade_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar modalidades:', erro);
            throw erro;
        }
    }

    static async buscarPorId(modalidade_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Modalidades WHERE modalidade_id = $1', [modalidade_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar modalidade por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('INSERT INTO Modalidades (nome) VALUES ($1) RETURNING *', [dados.nome]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar modalidade:', erro);
            throw erro;
        }
    }
}

module.exports = ModalidadeModel;
