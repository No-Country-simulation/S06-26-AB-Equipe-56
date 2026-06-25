const { conectarBanco, sql } = require('../config/db');

class EmpresaModel {
    
    static async listarTodas() {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request().query('SELECT * FROM Empresa');
            return resultado.recordset; 
        } catch (erro) {
            console.error("Erro ao buscar empresas no banco:", erro);
            throw erro;
        }
    }

    static async criar(empresaData) {
    try {
        const pool = await conectarBanco();

        const verificacao = await pool.request()
            .input('cnpj', sql.VarChar(20), empresaData.cnpj)
            .query('SELECT empresa_id FROM Empresa WHERE cnpj = @cnpj');

        if (verificacao.recordset.length > 0) {
            throw new Error("CNPJ_JA_EXISTENTE");
        }

        const resultado = await pool.request()
            .input('nome', sql.VarChar(255), empresaData.nome)
            .input('razao_social', sql.VarChar(255), empresaData.razao_social)
            .input('cnpj', sql.VarChar(20), empresaData.cnpj)
            .query(`
                INSERT INTO Empresa (nome, razao_social, cnpj)
                OUTPUT INSERTED.* VALUES (@nome, @razao_social, @cnpj)
            `);
        
        return resultado.recordset[0];
    } catch (erro) {
        throw erro;
    }
    }

    static async buscarPorId(empresa_id) {
    try {
        const pool = await conectarBanco();
        const resultado = await pool.request()
            .input('empresa_id', sql.Int, empresa_id)
            .query('SELECT nome, razao_social, cnpj FROM Empresa WHERE empresa_id = @empresa_id');
        
        return resultado.recordset[0];
    } catch (erro) {
        console.error("Erro ao buscar empresa:", erro);
        throw erro;
    }
}
}
module.exports = EmpresaModel;