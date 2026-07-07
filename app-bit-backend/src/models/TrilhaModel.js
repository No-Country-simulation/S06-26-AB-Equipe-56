const { conectarBanco } = require('../config/db_postgre');

class TrilhaModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Trilhas ORDER BY trilha_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar trilhas:', erro);
            throw erro;
        }
    }

    static async listarAtivas() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Trilhas WHERE ativo = true ORDER BY nome');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar trilhas ativas:', erro);
            throw erro;
        }
    }

    static async buscarPorId(trilha_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Trilhas WHERE trilha_id = $1', [trilha_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar trilha por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Trilhas (nome, descricao, categoria, ativo)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [dados.nome, dados.descricao ?? null, dados.categoria ?? null, dados.ativo ?? true]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar trilha:', erro);
            throw erro;
        }
    }
}

module.exports = TrilhaModel;
