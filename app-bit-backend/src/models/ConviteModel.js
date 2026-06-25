const { conectarBanco, sql } = require('../config/db');

class ConviteModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const resultado = await pool.request()
                .input('empresa_id', sql.Int, dados.empresa_id)
                .input('email_convidado', sql.VarChar(255), dados.email)
                .input('permissao_id', sql.Int, dados.permissao_id) 
                .query(`
                    INSERT INTO Convites (empresa_id, email_convidado, permissao_id, data_expiracao)
                    OUTPUT INSERTED.token, INSERTED.email_convidado, INSERTED.empresa_id, INSERTED.permissao_id
                    VALUES (@empresa_id, @email_convidado, @permissao_id, DATEADD(hour, 24, GETDATE()))
                `);

            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao criar convite no banco:", erro);
            throw erro;
        }
    }

    static async validarToken(token) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('token', sql.UniqueIdentifier, token)
                .query("SELECT * FROM Convites WHERE token = @token AND status = 'Pendente' AND data_expiracao > GETDATE()");
            
            return resultado.recordset[0]; 
        } catch (erro) {
            console.error("Erro ao validar o token no banco:", erro);
            throw erro;
        }
    }

    static async marcarComoAceito(token) {
        try {
            const pool = await conectarBanco();
            await pool.request()
                .input('token', sql.UniqueIdentifier, token)
                .query("UPDATE Convites SET status = 'Aceito' WHERE token = @token");
        } catch (erro) {
            console.error("Erro ao atualizar status do convite:", erro);
            throw erro;
        }
    }
    static async listarPorEmpresa(empresa_id) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('empresa_id', sql.Int, empresa_id)
                .query(`
                    SELECT 
                        convite_id, 
                        email_convidado, 
                        permissao_id, 
                        status, 
                        data_criacao, 
                        data_expiracao
                    FROM Convites 
                    WHERE empresa_id = @empresa_id
                    ORDER BY data_criacao DESC
                `);
            
            return resultado.recordset;
        } catch (erro) {
            console.error("Erro ao listar convites no banco:", erro);
            throw erro;
        }
    }
}

module.exports = ConviteModel;