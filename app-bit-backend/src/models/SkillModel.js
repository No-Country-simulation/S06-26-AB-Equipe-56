const { conectarBanco } = require('../config/db_postgre');

class SkillModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Skills ORDER BY skill_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar skills:', erro);
            throw erro;
        }
    }

    static async buscarPorId(skill_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Skills WHERE skill_id = $1', [skill_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar skill por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Skills (tipo_skill, nome_skill) VALUES ($1, $2) RETURNING *',
                [dados.tipo_skill, dados.nome_skill]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar skill:', erro);
            throw erro;
        }
    }
}

module.exports = SkillModel;
