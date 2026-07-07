const { conectarBanco } = require('../config/db_postgre');

class EscolaridadeModel {
    static async listarPorCurriculo(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Escolaridade WHERE curriculo_id = $1 ORDER BY data_inicio DESC', [curriculo_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar escolaridades do candidato:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Escolaridade (curriculo_id, nome_instituicao, curso, tipo_escolaridade, concluido, modalidade, data_inicio, data_fim)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
                [dados.curriculo_id, dados.nome_instituicao, dados.curso, dados.tipo_escolaridade, dados.concluido ?? false, dados.modalidade, dados.data_inicio ?? null, dados.data_fim ?? null]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar escolaridade:', erro);
            throw erro;
        }
    }
}

module.exports = EscolaridadeModel;
