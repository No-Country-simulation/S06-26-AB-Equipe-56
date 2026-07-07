const { conectarBanco, sql } = require('../config/db');

class VagaModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const resultado = await pool.request()
                .input('recrutador_id', sql.Int, dados.recrutador_id)
                .input('empresa_id', sql.Int, dados.empresa_id)
                .input('titulo', sql.VarChar(255), dados.titulo)
                .input('descricao', sql.VarChar(sql.MAX), dados.descricao)
                .input('cargo_id', sql.Int, dados.cargo_id)
                .input('senioridade_id', sql.Int, dados.senioridade_id)
                .input('modalidade_id', sql.Int, dados.modalidade_id)
                .query(`
                    INSERT INTO Vagas (recrutador_id, empresa_id, titulo, descricao, cargo_id, senioridade_id, modalidade_id)
                    OUTPUT INSERTED.*
                    VALUES (@recrutador_id, @empresa_id, @titulo, @descricao, @cargo_id, @senioridade_id, @modalidade_id)
                `);

            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao criar vaga no banco:", erro);
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
                        v.vaga_id, v.titulo, v.data_cadastro,
                        c.nome AS cargo, 
                        s.nome AS senioridade, 
                        m.nome AS modalidade
                    FROM Vagas v
                    LEFT JOIN Cargos c ON v.cargo_id = c.cargo_id
                    LEFT JOIN Senioridades s ON v.senioridade_id = s.senioridade_id
                    LEFT JOIN Modalidades m ON v.modalidade_id = m.modalidade_id
                    WHERE v.empresa_id = @empresa_id
                    ORDER BY v.data_cadastro DESC
                `);
            return resultado.recordset;
        } catch (erro) {
            console.error("Erro ao listar vagas:", erro);
            throw erro;
        }
    }

    static async buscarVagaPorId(vaga_id, empresa_id) {
        try {
            const pool = await conectarBanco();
            const resultado = await pool.request()
                .input('vaga_id', sql.Int, vaga_id)
                .input('empresa_id', sql.Int, empresa_id)
                .query(`
                    SELECT 
                        vaga_id,
                        recrutador_id,
                        empresa_id,
                        vaga_titulo AS titulo,
                        vaga_descricao AS descricao,
                        vaga_data_cadastro AS data_cadastro,
                        cargo_nome AS cargo,
                        senioridade_nome AS senioridade,
                        modalidade_nome AS modalidade,
                        requisitos_skills
                    FROM vw_detalhes_vaga
                    WHERE vaga_id = @vaga_id AND empresa_id = @empresa_id
                `);
            return resultado.recordset[0];
        } catch (erro) {
            console.error("Erro ao buscar vaga por ID na view vw_detalhes_vaga:", erro);
            throw erro;
        }
    }
}

module.exports = VagaModel;