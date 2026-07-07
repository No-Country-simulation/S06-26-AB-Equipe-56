const CandidaturaModel = require('../models/CandidaturaModel');

const listarCandidaturas = async (req, res) => {
    try {
        const empresaId = req.usuarioLogado?.empresa_id;
        if (!empresaId) {
            return res.status(400).json({ mensagem: 'Empresa do usuário não identificada.' });
        }
        const candidaturas = await CandidaturaModel.listarPorEmpresa(empresaId);
        res.status(200).json(candidaturas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar candidaturas.' });
    }
};

const buscarCandidaturaPorId = async (req, res) => {
    try {
        const candidatura = await CandidaturaModel.buscarPorId(req.params.id);
        if (!candidatura) {
            return res.status(404).json({ mensagem: 'Candidatura não encontrada.' });
        }
        res.status(200).json(candidatura);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar candidatura.' });
    }
};

const listarCandidaturasPorCurriculo = async (req, res) => {
    try {
        const candidaturas = await CandidaturaModel.listarPorCurriculo(req.params.curriculoId);
        res.status(200).json(candidaturas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar candidaturas do currículo.' });
    }
};

const ContratacaoModel = require('../models/ContratacaoModel');

const criarCandidatura = async (req, res) => {
    try {
        const { vaga_id, curriculo_id } = req.body;
        
        // Evita a duplicação se já houver candidatura para vaga + candidato
        const existente = await CandidaturaModel.buscarPorVagaECurriculo(vaga_id, curriculo_id);
        if (existente) {
            return res.status(200).json(existente);
        }

        const novaCandidatura = await CandidaturaModel.criar(req.body);
        res.status(201).json(novaCandidatura);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar candidatura.' });
    }
};

const atualizarStatusCandidatura = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ mensagem: 'O status é obrigatório.' });
        }

        const candidaturaExistente = await CandidaturaModel.buscarPorId(id);
        if (!candidaturaExistente) {
            return res.status(404).json({ mensagem: 'Candidatura não encontrada.' });
        }

        const candidaturaAtualizada = await CandidaturaModel.atualizarStatus(id, status);

        // Se o status for contratado, insere automaticamente na tabela de contratação
        if (status.toLowerCase() === 'contratado') {
            const { conectarBanco } = require('../config/db_postgre');
            const pool = await conectarBanco();
            
            // Verifica duplicados de contratação
            const resultCheck = await pool.query('SELECT * FROM Contratacao WHERE candidatura_id = $1', [id]);
            if (resultCheck.rows.length === 0) {
                const salario = candidaturaExistente.pretencao_salarial || 5000;
                await ContratacaoModel.criar({
                    candidatura_id: id,
                    salario: salario
                });
            }
        }

        res.status(200).json({ 
            mensagem: 'Status da candidatura atualizado com sucesso.', 
            candidatura: candidaturaAtualizada 
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar status da candidatura.' });
    }
};

module.exports = { 
    listarCandidaturas, 
    buscarCandidaturaPorId, 
    listarCandidaturasPorCurriculo, 
    criarCandidatura,
    atualizarStatusCandidatura
};
