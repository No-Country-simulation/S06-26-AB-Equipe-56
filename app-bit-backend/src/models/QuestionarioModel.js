const { conectarBanco } = require('../config/db_postgre');

class QuestionarioModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Questionarios ORDER BY questionario_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar questionários:', erro);
            throw erro;
        }
    }

    static async listarPorModulo(modulo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Questionarios WHERE modulo_id = $1 ORDER BY questionario_id',
                [modulo_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar questionários por módulo:', erro);
            throw erro;
        }
    }

    static async buscarPorId(questionario_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Questionarios WHERE questionario_id = $1', [questionario_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar questionário por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Questionarios (modulo_id, nome, nota_minima_aprovacao, tentativas_permitidas)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [dados.modulo_id, dados.nome, dados.nota_minima_aprovacao, dados.tentativas_permitidas ?? 1]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar questionário:', erro);
            throw erro;
        }
    }
}

module.exports = QuestionarioModel;
