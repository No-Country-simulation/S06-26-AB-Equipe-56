const { conectarBanco } = require('../config/db_postgre');

class CurriculoModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Curriculo ORDER BY curriculo_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar currículos:', erro);
            throw erro;
        }
    }

    static async buscarPorId(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Curriculo WHERE curriculo_id = $1', [curriculo_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar currículo por ID:', erro);
            throw erro;
        }
    }

    static async buscarPorCandidato(candidato_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Curriculo WHERE candidato_id = $1 ORDER BY data_cadastro DESC', [candidato_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao buscar currículo por candidato:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Curriculo (candidato_id) VALUES ($1) RETURNING *',
                [dados.candidato_id]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar currículo:', erro);
            throw erro;
        }
    }
}

module.exports = CurriculoModel;
