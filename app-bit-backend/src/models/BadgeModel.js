const { conectarBanco } = require('../config/db_postgre');

class BadgeModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Badges ORDER BY badge_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar badges:', erro);
            throw erro;
        }
    }

    static async buscarPorId(badge_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Badges WHERE badge_id = $1', [badge_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar badge por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('INSERT INTO Badges (nome) VALUES ($1) RETURNING *', [dados.nome]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar badge:', erro);
            throw erro;
        }
    }
}

module.exports = BadgeModel;
