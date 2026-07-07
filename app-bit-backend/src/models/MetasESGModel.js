const { conectarBanco } = require('../config/db_postgre');

class MetasESGModel {
    static async listarTodos() {
        const pool = await conectarBanco();
        const { rows } = await pool.query('SELECT * FROM metasesg');
        return rows;
    }

    static async criar(dados) {
        const pool = await conectarBanco();
        const existing = await pool.query(
            'SELECT * FROM metasesg WHERE empresa_id = $1 AND badge_id = $2',
            [dados.empresa_id, dados.badge_id]
        );

        if (existing.rows.length > 0) {
            const resultado = await pool.query(
                `UPDATE metasesg 
                 SET porcentagem = $3, quantidade = $4 
                 WHERE empresa_id = $1 AND badge_id = $2`,
                [dados.empresa_id, dados.badge_id, dados.porcentagem, dados.quantidade]
            );
            return resultado.rowCount;
        } else {
            const resultado = await pool.query(
                `INSERT INTO metasesg (empresa_id, badge_id, porcentagem, quantidade)
                 VALUES ($1, $2, $3, $4)`,
                [dados.empresa_id, dados.badge_id, dados.porcentagem, dados.quantidade]
            );
            return resultado.rowCount;
        }
    }

    static async buscarPorEmpresa(empresaId) {
        const pool = await conectarBanco();
        const { rows } = await pool.query(
            'SELECT * FROM metasesg WHERE empresa_id = $1',
            [empresaId]
        );
        return rows;
    }
}

module.exports = MetasESGModel;