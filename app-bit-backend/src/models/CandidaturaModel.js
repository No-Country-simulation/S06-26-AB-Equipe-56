const { conectarBanco } = require('../config/db_postgre');

class CandidaturaModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Candidatura ORDER BY data_candidatura DESC');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar candidaturas:', erro);
            throw erro;
        }
    }

    static async buscarPorId(candidatura_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Candidatura WHERE candidatura_id = $1', [candidatura_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar candidatura por ID:', erro);
            throw erro;
        }
    }

    static async listarPorCurriculo(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Candidatura WHERE curriculo_id = $1 ORDER BY data_candidatura DESC', [curriculo_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar candidaturas por currículo:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Candidatura (curriculo_id, vaga_id, status, pretencao_salarial)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [dados.curriculo_id, dados.vaga_id, dados.status, dados.pretencao_salarial ?? null]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar candidatura:', erro);
            throw erro;
        }
    }
}

module.exports = CandidaturaModel;
