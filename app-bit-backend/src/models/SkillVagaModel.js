const { conectarBanco } = require('../config/db_postgre');

class SkillVagaModel {
    static async listarPorVaga(vaga_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Skills_Vaga WHERE vaga_id = $1', [vaga_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar skills da vaga:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Skills_Vaga (skill_id, vaga_id, nivel_skill, obrigatorio, peso)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [dados.skill_id, dados.vaga_id, dados.nivel_skill, dados.obrigatorio ?? false, dados.peso ?? 1]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar vínculo de skill com vaga:', erro);
            throw erro;
        }
    }
}

module.exports = SkillVagaModel;
