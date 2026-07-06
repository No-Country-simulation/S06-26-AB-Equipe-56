const { conectarBanco, sql } = require('../config/db');

class SenioridadesModel {
    // Método para criar uma nova senioridade (ex: Junior, Pleno, Senior)
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const resultado = await pool.request()
                .input('nome', sql.VarChar(255), dados.nome)
                .query(`
                    INSERT INTO Senioridades (nome)
                    OUTPUT INSERTED.senioridade_id, INSERTED.nome
                    VALUES (@nome)
                `);

            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao criar senioridade na base de dados:", erro);
            throw erro;
        }
    }

    // Método para listar todas as senioridades
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .query(`
                    SELECT 
                        senioridade_id, 
                        nome
                    FROM Senioridades 
                    -- Ordenamos pelo ID assumindo que a inserção segue a ordem lógica (1-Junior, 2-Pleno, 3-Senior)
                    ORDER BY senioridade_id ASC
                `);
            
            return resultado.recordset;
        } catch (erro) {
            console.error("Erro ao listar senioridades na base de dados:", erro);
            throw erro;
        }
    }

    // Método para buscar uma senioridade específica por ID
    static async buscarPorId(senioridade_id) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('senioridade_id', sql.Int, senioridade_id)
                .query(`
                    SELECT senioridade_id, nome
                    FROM Senioridades 
                    WHERE senioridade_id = @senioridade_id
                `);
            
            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao buscar senioridade na base de dados:", erro);
            throw erro;
        }
    }
}

module.exports = SenioridadesModel;