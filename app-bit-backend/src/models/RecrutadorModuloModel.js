const { conectarBanco } = require('../config/db_postgre');

class RecrutadorModuloModel {
    static async listarPorRecrutador(recrutador_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Recrutadores_Modulos WHERE recrutador_id = $1 ORDER BY data_inicio DESC',
                [recrutador_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar módulos do recrutador:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Recrutadores_Modulos (recrutador_id, modulo_id, status, data_inicio, data_conclusao)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [dados.recrutador_id, dados.modulo_id, dados.status, dados.data_inicio ?? null, dados.data_conclusao ?? null]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao associar módulo ao recrutador:', erro);
            throw erro;
        }
    }
}

module.exports = RecrutadorModuloModel;
