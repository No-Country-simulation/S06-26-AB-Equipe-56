const { conectarBanco } = require('../config/db_postgre');

class AderenciaMetaESGModel {
    static async listarPorContratacao(contratacao_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM AderenciaMetasESG WHERE contratacao_id = $1', [contratacao_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar aderência de metas ESG:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO AderenciaMetasESG (meta_id, contratacao_id) VALUES ($1, $2) RETURNING *',
                [dados.meta_id, dados.contratacao_id]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar aderência de meta ESG:', erro);
            throw erro;
        }
    }
}

module.exports = AderenciaMetaESGModel;
