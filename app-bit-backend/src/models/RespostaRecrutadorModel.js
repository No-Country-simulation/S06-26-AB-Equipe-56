const { conectarBanco } = require('../config/db_postgre');

class RespostaRecrutadorModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO RespostasRecrutador (recrutador_id, questionario_id, questao_id, alternativa_id, tentativa, correta)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [dados.recrutador_id, dados.questionario_id, dados.questao_id, dados.alternativa_id, dados.tentativa ?? 1, dados.correta]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao salvar resposta do recrutador:', erro);
            throw erro;
        }
    }

    static async listarPorRecrutador(recrutador_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM RespostasRecrutador WHERE recrutador_id = $1 ORDER BY data_resposta DESC',
                [recrutador_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar respostas do recrutador:', erro);
            throw erro;
        }
    }
}

module.exports = RespostaRecrutadorModel;
