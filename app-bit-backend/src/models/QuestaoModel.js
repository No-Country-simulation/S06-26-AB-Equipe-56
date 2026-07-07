const { conectarBanco } = require('../config/db_postgre');

class QuestaoModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Questoes ORDER BY questionario_id, ordem');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar questões:', erro);
            throw erro;
        }
    }

    static async listarPorQuestionario(questionario_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Questoes WHERE questionario_id = $1 ORDER BY ordem',
                [questionario_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar questões por questionário:', erro);
            throw erro;
        }
    }

    static async buscarPorId(questao_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Questoes WHERE questao_id = $1', [questao_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar questão por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Questoes (questionario_id, enunciado, ordem)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [dados.questionario_id, dados.enunciado, dados.ordem]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar questão:', erro);
            throw erro;
        }
    }
}

module.exports = QuestaoModel;
