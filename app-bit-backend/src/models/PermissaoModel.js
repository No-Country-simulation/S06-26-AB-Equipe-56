const { conectarBanco } = require('../config/db_postgre');

class PermissaoModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Permissoes ORDER BY permissao_id');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar permissões:', erro);
            throw erro;
        }
    }

    static async buscarPorId(permissao_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Permissoes WHERE permissao_id = $1', [permissao_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar permissão por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'INSERT INTO Permissoes (nome) VALUES ($1) RETURNING *',
                [dados.nome]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar permissão:', erro);
            throw erro;
        }
    }
}

module.exports = PermissaoModel;
