const { conectarBanco } = require('../config/db_postgre');

class ExperienciaCandidatoModel {
    static async listarPorCurriculo(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM ExperienciaCandidato WHERE curriculo_id = $1 ORDER BY data_inicio DESC', [curriculo_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar experiências do candidato:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO ExperienciaCandidato (curriculo_id, cargo_id, salario, senioridade_id, descricao, empresa, data_inicio, data_fim, is_atual)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING *`,
                [dados.curriculo_id, dados.cargo_id, dados.salario ?? null, dados.senioridade_id, dados.descricao ?? null, dados.empresa ?? null, dados.data_inicio ?? null, dados.data_fim ?? null, dados.is_atual ?? false]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar experiência do candidato:', erro);
            throw erro;
        }
    }
}

module.exports = ExperienciaCandidatoModel;
