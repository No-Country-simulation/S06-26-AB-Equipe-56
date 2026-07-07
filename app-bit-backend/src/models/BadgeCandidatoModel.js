const { conectarBanco } = require('../config/db_postgre');

class BadgeCandidatoModel {
    static async listarPorCandidato(candidato_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Badges_Candidato WHERE candidato_id = $1', [candidato_id]);
            return rows;
        } catch (erro) {
            console.error('Erro ao listar badges do candidato:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Badges_Candidato (badge_id, candidato_id) VALUES ($1, $2) RETURNING *',
                [dados.badge_id, dados.candidato_id]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar vínculo de badge com candidato:', erro);
            throw erro;
        }
    }
}

module.exports = BadgeCandidatoModel;
