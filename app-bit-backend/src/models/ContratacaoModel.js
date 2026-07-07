const { conectarBanco } = require('../config/db_postgre');

class ContratacaoModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Contratacao ORDER BY contratacao_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar contratações:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Contratacao (candidatura_id, salario) VALUES ($1, $2) RETURNING *',
                [dados.candidatura_id, dados.salario]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar contratação:', erro);
            throw erro;
        }
    }
}

module.exports = ContratacaoModel;
