const { conectarBanco } = require('../config/db_postgre');

class AlternativaQuestaoModel {
    static async listarPorQuestao(questao_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM AlternativasQuestao WHERE questao_id = $1 ORDER BY alternativa_id',
                [questao_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar alternativas da questão:', erro);
            throw erro;
        }
    }

    static async buscarPorId(alternativa_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM AlternativasQuestao WHERE alternativa_id = $1', [alternativa_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar alternativa por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO AlternativasQuestao (questao_id, texto, correta)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [dados.questao_id, dados.texto, dados.correta ?? false]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar alternativa:', erro);
            throw erro;
        }
    }
}

module.exports = AlternativaQuestaoModel;
