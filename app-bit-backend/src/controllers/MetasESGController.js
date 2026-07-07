const MetasESGModel = require('../models/MetasESGModel');
const { conectarBanco } = require('../config/db_postgre');

class MetasESGController {
    static async listar(req, res) {
        try {
            const empresaId = req.usuarioLogado?.empresa_id || req.query.empresa_id;
            if (!empresaId) {
                return res.status(200).json([]);
            }
            const metas = await MetasESGModel.buscarPorEmpresa(empresaId);
            res.status(200).json(metas);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao listar metas" });
        }
    }

    static async cadastrar(req, res) {
        try {
            // Se autenticado, garante o empresa_id da requisição
            const dados = {
                ...req.body,
                empresa_id: req.usuarioLogado?.empresa_id || req.body.empresa_id
            };
            await MetasESGModel.criar(dados);
            res.status(201).json({ mensagem: "Meta cadastrada com sucesso!" });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao cadastrar meta" });
        }
    }

    static async buscarRelatorioAderencia(req, res) {
        try {
            const empresaId = req.usuarioLogado?.empresa_id || req.query.empresa_id;
            if (!empresaId) {
                return res.status(200).json([]);
            }
            const pool = await conectarBanco();
            const resultado = await pool.query(`
                SELECT 
                    e.nome AS empresa,
                    b.nome AS categoria_esg,
                    m.porcentagem AS meta,
                    COUNT(bc.candidato_id) AS contratacoes_realizadas
                FROM Empresa e
                JOIN metasesg m ON e.empresa_id = m.empresa_id
                JOIN Badges b ON m.badge_id = b.badge_id
                LEFT JOIN (
                    SELECT c.vaga_id, v.empresa_id, curr.candidato_id, bc_inner.badge_id
                    FROM Contratacao con
                    JOIN Candidatura c ON con.candidatura_id = c.candidatura_id
                    JOIN Vagas v ON c.vaga_id = v.vaga_id
                    JOIN Curriculo curr ON c.curriculo_id = curr.curriculo_id
                    JOIN Badges_Candidato bc_inner ON curr.candidato_id = bc_inner.candidato_id
                ) bc ON bc.badge_id = b.badge_id AND bc.empresa_id = e.empresa_id
                WHERE e.empresa_id = $1
                GROUP BY e.nome, b.nome, m.porcentagem
            `, [empresaId]);
            res.status(200).json(resultado.rows);
        } catch (erro) {
            console.error("Erro ao obter relatório de aderência:", erro);
            res.status(500).json({ erro: "Erro ao obter relatório de aderência ESG" });
        }
    }
}
module.exports = MetasESGController;