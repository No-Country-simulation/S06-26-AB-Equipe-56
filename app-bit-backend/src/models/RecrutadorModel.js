const { conectarBanco, sql } = require('../config/db');
const bcrypt = require('bcrypt');

class RecrutadorModel {
    
    static async listarTodos() {
        const pool = await conectarBanco();
        const resultado = await pool.request().query('SELECT recrutador_id, nome, email, empresa_id FROM Recrutadores');
        return resultado.recordset;
    }

    static async buscarPorId(id) {
        const pool = await conectarBanco(); 
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT recrutador_id, nome, email, empresa_id FROM Recrutadores WHERE recrutador_id = @id');
        return resultado.recordset[0];
    }

    static async criar(dados) {
        const pool = await conectarBanco();
        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const resultado = await pool.request()
            .input('nome', sql.VarChar, dados.nome)
            .input('email', sql.VarChar, dados.email)
            .input('senha', sql.VarChar, senhaHash)
            .input('empresa_id', sql.Int, dados.empresa_id)
            .input('permissao_id', sql.Int, dados.permissao_id) 
            .query(`
                INSERT INTO Recrutadores (nome, email, senha, empresa_id, permissao_id)
                OUTPUT INSERTED.recrutador_id, INSERTED.nome, INSERTED.email, INSERTED.permissao_id
                VALUES (@nome, @email, @senha, @empresa_id, @permissao_id)
            `);
        return resultado.recordset[0];
    }
    static async buscarPorEmail(email) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('email', sql.VarChar, email)
                .query('SELECT recrutador_id, nome, email, senha, empresa_id, permissao_id FROM Recrutadores WHERE email = @email');
            
            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao buscar recrutador por email:", erro);
            throw erro;
        }
    }
}

module.exports = RecrutadorModel;
