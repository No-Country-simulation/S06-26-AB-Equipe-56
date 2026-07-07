const { conectarBanco } = require('../config/db_postgre');

class MetaESGModel {
    static async listarPorEmpresa(empresa_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM MetasESG WHERE empresa_id = $1 ORDER BY meta_id', [empresa_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar metas ESG da empresa:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO MetasESG (empresa_id, badge_id, porcentagem, quantidade)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [dados.empresa_id, dados.badge_id, dados.porcentagem ?? null, dados.quantidade ?? null]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar meta ESG:', erro);
            throw erro;
        }
    }
}

module.exports = MetaESGModel;
