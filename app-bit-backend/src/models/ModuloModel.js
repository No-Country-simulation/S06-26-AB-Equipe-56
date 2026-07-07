const { conectarBanco } = require('../config/db_postgre');

class ModuloModel {
    static async listarTodos() {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Modulos ORDER BY trilha_id, ordem');
            return rows;
        } catch (erro) {
            console.error('Erro ao listar módulos:', erro);
            throw erro;
        }
    }

    static async listarPorTrilha(trilha_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                'SELECT * FROM Modulos WHERE trilha_id = $1 ORDER BY ordem',
                [trilha_id]
            );
            return rows;
        } catch (erro) {
            console.error('Erro ao listar módulos por trilha:', erro);
            throw erro;
        }
    }

    static async buscarPorId(modulo_id) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query('SELECT * FROM Modulos WHERE modulo_id = $1', [modulo_id]);
            return rows[0];
        } catch (erro) {
            console.error('Erro ao buscar módulo por ID:', erro);
            throw erro;
        }
    }

    static async criar(dados) {
        try {
            const pool = await conectarBanco();
            const { rows } = await pool.query(
                `INSERT INTO Modulos (trilha_id, nome, descricao, conteudo_url, duracao_minutos, ordem)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [dados.trilha_id, dados.nome, dados.descricao ?? null, dados.conteudo_url ?? null, dados.duracao_minutos ?? null, dados.ordem]
            );
            return rows[0];
        } catch (erro) {
            console.error('Erro ao criar módulo:', erro);
            throw erro;
        }
    }
}

module.exports = ModuloModel;
