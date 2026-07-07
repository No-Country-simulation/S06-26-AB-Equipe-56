const { conectarBanco } = require('../config/db_postgre');

class SkillCurriculoModel {
    static async listarPorCurriculo(curriculo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Skills_Curriculo WHERE curriculo_id = $1', [curriculo_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar skills do currículo:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Skills_Curriculo (skill_id, curriculo_id) VALUES ($1, $2) RETURNING *',
                [dados.skill_id, dados.curriculo_id]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar vínculo de skill com currículo:', erro);
            throw erro;
        }
    }
}

module.exports = SkillCurriculoModel;
