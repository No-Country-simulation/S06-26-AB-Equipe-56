const { conectarBanco } = require('../config/db_postgre');

class SaudeModel {

    static async verificarBanco() {
        const inicio = Date.now();
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT version() AS versao, now() AS agora');
            return {
                conectado: true,
                versao: rows[0].versao,
                horaBanco: rows[0].agora,
                tempoRespostaMs: Date.now() - inicio
            };
        } catch (erro) {
            console.error("Erro ao verificar conexão com o banco:", erro);
            return {
                conectado: false,
                erro: erro.message,
                tempoRespostaMs: Date.now() - inicio
            };
        }
    }

    static async registrarLog({ status, banco_conectado, tempo_resposta_ms, mensagem }) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO LogSaude (status, banco_conectado, tempo_resposta_ms, mensagem)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [status, banco_conectado, tempo_resposta_ms, mensagem]
            );
            return rows[0];
        } catch (erro) {
            console.error("Erro ao registrar log de saúde:", erro);
            throw erro;
        }
    }

    static async listarLogs(limite = 20) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `SELECT * FROM LogSaude
                 ORDER BY data_verificacao DESC
                 LIMIT $1`,
                [limite]
            );
            return rows;
        } catch (erro) {
            console.error("Erro ao listar logs de saúde:", erro);
            throw erro;
        }
    }
}

module.exports = SaudeModel;
