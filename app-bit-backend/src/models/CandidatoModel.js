const { conectarBanco } = require('../config/db_postgre');

class CandidatoModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Candidatos (nome, email, senha, telefone, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                [dados.nome, dados.email, dados.senha, dados.telefone, dados.cpf]
            );
            return rows[0];
        } catch (error) {
            console.error('Erro ao criar candidato:', error);
            throw error;
        }
    }

    static async buscarPorId(candidato_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Candidatos WHERE candidato_id = $1;',
                [candidato_id]
            );
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar candidato por ID:', error);
            throw error;
        }
    }

    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Candidatos;');
            return rows;
        } catch (error) {
            console.error('Erro ao listar candidatos:', error);
            throw error;
        }
    }

    static async buscar_perfil_completo_para_score(candidato_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Candidatos WHERE candidato_id = $1;',
                [candidato_id]
            );
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar perfil completo para score:', error);
            throw error;
        }
    }    
}

module.exports = CandidatoModel;