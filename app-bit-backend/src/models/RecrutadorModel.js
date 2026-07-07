const { conectarBanco } = require('../config/db_postgre');
const bcrypt = require('bcrypt');

class RecrutadorModel {
    
    static async listarTodos() {
        const pool = await conectarBanco();
        const { rows } = await pool.query('SELECT recrutador_id, nome, email, empresa_id, permissao_id FROM Recrutadores');
        return rows;
    }

    static async buscarPorId(id) {
        const pool = await conectarBanco(); 
        const { rows } = await pool.query(
            'SELECT recrutador_id, nome, email, empresa_id, permissao_id FROM Recrutadores WHERE recrutador_id = $1',
            [id]
        );
        return rows[0];
    }

    static async criar(dados) {
        const pool = await conectarBanco();
        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const { rows } = await pool.query(`
            INSERT INTO Recrutadores (nome, email, senha, empresa_id, permissao_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING recrutador_id, nome, email, permissao_id
        `, [dados.nome, dados.email, senhaHash, dados.empresa_id, dados.permissao_id]);
        return rows[0];
    }
    static async buscarPorEmail(email) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT recrutador_id, nome, email, senha, empresa_id, permissao_id FROM Recrutadores WHERE email = $1',
                [email]
            );
            
            return rows[0];
        } catch (erro) {
            console.error("Erro ao buscar recrutador por email:", erro);
            throw erro;
        }
    }
}

module.exports = RecrutadorModel;
