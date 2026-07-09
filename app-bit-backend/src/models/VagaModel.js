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
            const { rows } = await pool.query(
                `SELECT
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
                 WHERE vaga_id = $1 AND empresa_id = $2`,
                [vaga_id, empresa_id]
            );
            return rows[0];
        } catch (erro) {
            const mensagem = erro?.message || '';
            // Fallback para as tabelas base caso a view vw_detalhes_vaga não exista
            if (erro?.code === '42P01' || mensagem.includes('vw_detalhes_vaga')) {
                try {
                    const pool = await conectarBanco();
                    const { rows } = await pool.query(
                        `SELECT
                            v.vaga_id,
                            v.recrutador_id,
                            v.empresa_id,
                            v.titulo,
                            v.descricao,
                            v.data_cadastro,
                            c.nome AS cargo,
                            s.nome AS senioridade,
                            m.nome AS modalidade,
                            '[]'::jsonb AS requisitos_skills
                         FROM Vagas v
                         JOIN Cargos c ON v.cargo_id = c.cargo_id
                         JOIN Senioridades s ON v.senioridade_id = s.senioridade_id
                         JOIN Modalidades m ON v.modalidade_id = m.modalidade_id
                         WHERE v.vaga_id = $1 AND v.empresa_id = $2`,
                        [vaga_id, empresa_id]
                    );
                    return rows[0];
                } catch (fallbackErro) {
                    console.error("Erro ao buscar vaga por ID usando as tabelas base:", fallbackErro);
                    throw fallbackErro;
                }
            }

            console.error("Erro ao buscar vaga por ID na view vw_detalhes_vaga:", erro);
            throw erro;
        }
    }

    // Alias mantido para compatibilidade com o VagaController (chama buscarPorId)
    static async buscarPorId(vaga_id, empresa_id) {
        return this.buscarVagaPorId(vaga_id, empresa_id);
    }
}

module.exports = VagaModel;
