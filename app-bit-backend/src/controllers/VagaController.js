const VagaModel = require('../models/VagaModel');

const criarVaga = async (req, res) => {
    try {
        const recrutador_id = req.usuarioLogado.id;
        const empresa_id = req.usuarioLogado.empresa_id;

        const { titulo, descricao, cargo_id, senioridade_id, modalidade_id } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({ mensagem: "Título e descrição são campos obrigatórios." });
        }

        const novaVaga = await VagaModel.criar({
            recrutador_id,
            empresa_id,
            titulo,
            descricao,
            cargo_id,
            senioridade_id,
            modalidade_id
        });

        res.status(201).json({
            mensagem: "Vaga publicada com sucesso!",
            vaga: novaVaga
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao publicar a vaga." });
    }
};
const listarVagas = async (req, res) => {
    try {
        const empresa_id = req.usuarioLogado.empresa_id;
        const vagas = await VagaModel.listarPorEmpresa(empresa_id);

        res.status(200).json(vagas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao listar as vagas." });
    }
};

const buscarVagaPorId = async (req, res) => {
    try {
        const empresa_id = req.usuarioLogado.empresa_id;
        const { id } = req.params;

        const vaga = await VagaModel.buscarPorId(id, empresa_id);

        if (!vaga) {
            return res.status(404).json({ mensagem: "Vaga não encontrada ou não pertence à sua empresa." });
        }

        res.status(200).json(vaga);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar a vaga." });
    }
};

module.exports = { criarVaga, listarVagas, buscarVagaPorId };