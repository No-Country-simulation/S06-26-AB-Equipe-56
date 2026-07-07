const { conectarBanco } = require('../config/db_postgre');

class ResultadoQuestionarioModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO ResultadosQuestionario (recrutador_id, questionario_id, tentativa, total_questoes, total_acertos, total_erros, nota, aprovado)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
                [dados.recrutador_id, dados.questionario_id, dados.tentativa ?? 1, dados.total_questoes, dados.total_acertos, dados.total_erros, dados.nota, dados.aprovado]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao salvar resultado do questionário:', erro);
            throw erro;
        }
    }

    static async listarPorRecrutador(recrutador_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM ResultadosQuestionario WHERE recrutador_id = $1 ORDER BY data_realizacao DESC',
                [recrutador_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar resultados do recrutador:', erro);
            throw erro;
        }
    }
}

module.exports = ResultadoQuestionarioModel;
