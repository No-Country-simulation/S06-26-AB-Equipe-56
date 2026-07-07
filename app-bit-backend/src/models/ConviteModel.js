const { conectarBanco } = require('../config/db_postgre');

class ConviteModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const { rows } = await pool.query(
                `INSERT INTO Convites (empresa_id, email_convidado, permissao_id, status, data_expiracao)
                 VALUES ($1, $2, $3, 'Pendente', NOW() + INTERVAL '24 hours')
                 RETURNING token, email_convidado, empresa_id, status, permissao_id`,
                [dados.empresa_id, dados.email, dados.permissao_id]
            );

            return rows[0];
        } catch (erro) {
            console.error("Erro ao criar convite no banco:", erro);
            throw erro;
        }
    }

    static async validarToken(token) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                "SELECT * FROM Convites WHERE token = $1 AND status = 'Pendente' AND data_expiracao > NOW()",
                [token]
            );
            
            return rows[0]; 
        } catch (erro) {
            console.error("Erro ao validar o token no banco:", erro);
            throw erro;
        }
    }

    static async marcarComoAceito(token) {
        try {
            const pool = await conectarBanco();
            await pool.query(
                "UPDATE Convites SET status = 'Aceito' WHERE token = $1",
                [token]
            );
        } catch (erro) {
            console.error("Erro ao atualizar status do convite:", erro);
            throw erro;
        }
    }
    static async listarPorEmpresa(empresa_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `SELECT 
                    convite_id, 
                    email_convidado, 
                    permissao_id, 
                    status, 
                    data_criacao, 
                    data_expiracao
                 FROM Convites 
                 WHERE empresa_id = $1
                 ORDER BY data_criacao DESC`,
                [empresa_id]
            );
            
            return rows;
        } catch (erro) {
            console.error("Erro ao listar convites no banco:", erro);
            throw erro;
        }
    }
}

module.exports = ConviteModel;