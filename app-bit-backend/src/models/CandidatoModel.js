const { conectarBanco, sql } = require('../config/db_postgre');

class CandidatoModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const result = await pool.request().input('nome', sql.VarChar, dados.nome).input('email', sql.VarChar, dados.email)
            .input('senha', sql.VarChar, dados.senha)
            .input('telefone', sql.VarChar, dados.telefone)
            .input('cpf', sql.VarChar, dados.cpf)
            .query('INSERT INTO Candidatos (nome, email, senha, telefone, cpf) VALUES (@nome, @email, @senha, @telefone, @cpf);');
            return result;
        } catch (error) {
            console.error('Erro ao criar candidato:', error);
            throw error;
        }
    }

    static async buscarPorId(candidato_id) {
        try {
            const pool = await conectarBanco();
            const result = await pool.request()
                .input('candidato_id', sql.Int, candidato_id)
                .query('SELECT * FROM Candidatos WHERE candidato_id = @candidato_id;');
            return result.recordset[0];
        } catch (error) {
            console.error('Erro ao buscar candidato por ID:', error);
            throw error;
        }
    }

    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const result = await pool.request().query('SELECT * FROM Candidatos;');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao listar candidatos:', error);
            throw error;
        }
    }

    static async buscar_perfil_completo_para_score(candidato_id) {
        try {
            const pool = await conectarBanco();
            const result = await pool.request()
                .input('candidato_id', sql.Int, candidato_id)
                .query('SELECT * FROM vw_perfil_completo_candidato WHERE candidato_id = @candidato_id;');
            return result.recordset[0];
        } catch (error) {
            console.error('Erro ao buscar perfil completo para score:', error);
            throw error;
        }
    }    
}

module.exports = CandidatoModel;