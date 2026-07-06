const { conectarBanco, sql } = require('../config/db');

class EscolaridadeModel {
    // Método para inserir um novo registo (usado pela Tool do MCP)
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const resultado = await pool.request()
                .input('curriculo_id', sql.Int, dados.curriculo_id)
                .input('nome_instituicao', sql.VarChar(255), dados.nome_instituicao)
                .input('curso', sql.VarChar(255), dados.curso)
                .input('tipo_escolaridade', sql.VarChar(100), dados.tipo_escolaridade)
                .input('concluido', sql.Bit, dados.concluido)
                .input('modalidade', sql.VarChar(50), dados.modalidade)
                .input('data_inicio', sql.DateTime, dados.data_inicio)
                .input('data_fim', sql.DateTime, dados.data_fim || null)
                .query(`
                    INSERT INTO Escolaridade (curriculo_id, nome_instituicao, curso, tipo_escolaridade, concluido, modalidade, data_inicio, data_fim)
                    OUTPUT INSERTED.escolaridade_id, INSERTED.curso, INSERTED.nome_instituicao
                    VALUES (@curriculo_id, @nome_instituicao, @curso, @tipo_escolaridade, @concluido, @modalidade, @data_inicio, @data_fim)
                `);

            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao criar escolaridade no banco:", erro);
            throw erro;
        }
    }

    // Método para listar os registos por currículo (usado pela Tool do MCP)
    static async listarPorCurriculo(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('curriculo_id', sql.Int, curriculo_id)
                .query(`
                    SELECT 
                        escolaridade_id, 
                        nome_instituicao, 
                        curso, 
                        tipo_escolaridade, 
                        concluido, 
                        modalidade, 
                        data_inicio, 
                        data_fim
                    FROM Escolaridade 
                    WHERE curriculo_id = @curriculo_id
                    ORDER BY data_inicio DESC
                `);
            
            return resultado.recordset;
        } catch (erro) {
            console.error("Erro ao listar escolaridades no banco:", erro);
            throw erro;
        }
    }
}

module.exports = EscolaridadeModel;