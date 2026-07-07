const { conectarBanco } = require('../config/db_postgre');

class VagaModel {
    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            
            const { rows } = await pool.query(
                `INSERT INTO Vagas (recrutador_id, empresa_id, titulo, descricao, cargo_id, senioridade_id, modalidade_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [dados.recrutador_id, dados.empresa_id, dados.titulo, dados.descricao, dados.cargo_id, dados.senioridade_id, dados.modalidade_id]
            );

            return rows[0];
        } catch (erro) {
            console.error("Erro ao criar vaga no banco:", erro);
            throw erro;
        }
    }
    static async listarPorEmpresa(empresa_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `SELECT 
                    v.vaga_id, v.titulo, v.data_cadastro, v.recrutador_id,
                    r.nome AS recrutador_responsavel,
                    c.nome AS cargo, 
                    s.nome AS senioridade, 
                    m.nome AS modalidade
                 FROM Vagas v
                 LEFT JOIN Recrutadores r ON v.recrutador_id = r.recrutador_id
                 LEFT JOIN Cargos c ON v.cargo_id = c.cargo_id
                 LEFT JOIN Senioridades s ON v.senioridade_id = s.senioridade_id
                 LEFT JOIN Modalidades m ON v.modalidade_id = m.modalidade_id
                 WHERE v.empresa_id = $1
                 ORDER BY v.data_cadastro DESC`,
                [empresa_id]
            );
            return rows;
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