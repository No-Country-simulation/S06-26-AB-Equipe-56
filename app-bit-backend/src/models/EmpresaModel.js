const { conectarBanco } = require('../config/db_postgre');

class EmpresaModel {

    static async listarTodas() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Empresa');
            return rows;
        } catch (erro) {
            console.error("Erro ao buscar empresas no banco:", erro);
            throw erro;
        }
    }

    static async criar(empresaData) {
        try {
            const pool = await conectarBanco();

            const verificacao = await pool.query(
                'SELECT empresa_id FROM Empresa WHERE cnpj = $1',
                [empresaData.cnpj]
            );

            if (verificacao.rows.length > 0) {
                throw new Error("CNPJ_JA_EXISTENTE");
            }

            const { rows } = await pool.query(
                `INSERT INTO Empresa (nome, razao_social, cnpj)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [empresaData.nome, empresaData.razao_social, empresaData.cnpj]
            );

            return rows[0];
        } catch (erro) {
            throw erro;
        }
    }

    static async buscarPorId(empresa_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT nome, razao_social, cnpj FROM Empresa WHERE empresa_id = $1',
                [empresa_id]
            );

            return rows[0];
        } catch (erro) {
            console.error("Erro ao buscar empresa:", erro);
            throw erro;
        }
    }
}

module.exports = EmpresaModel;