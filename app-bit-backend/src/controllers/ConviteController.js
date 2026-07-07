const ConviteModel = require('../models/ConviteModel');
const RecrutadorModel = require('../models/RecrutadorModel');

const gerarConvite = async (req, res) => {
    try {
        const { empresa_id, email, permissao_id } = req.body;

        if (!empresa_id || !email || !permissao_id) {
            return res.status(400).json({ 
                mensagem: "Os campos empresa_id, email e permissao_id são obrigatórios." 
            });
        }

        const novoConvite = await ConviteModel.criar({ empresa_id, email, permissao_id });
        const linkParaTestes = `http://localhost:3000/api/convites/aceitar?token=${novoConvite.token}`;

        res.status(201).json({
            mensagem: "Convite gerado com sucesso!",
            dados_convite: novoConvite,
            link_acesso: linkParaTestes
        });
    } catch (erro) {
        console.error("Erro ao gerar convite:", erro);
        res.status(500).json({ mensagem: "Erro interno ao gerar o convite." });
    }
};

const aceitarConvite = async (req, res) => {
    try {
        const { token, nome, senha } = req.body;

        if (!token || !nome || !senha) {
            return res.status(400).json({ mensagem: "Token, nome e senha são obrigatórios." });
        }

        const conviteValido = await ConviteModel.validarToken(token);

        if (!conviteValido) {
            return res.status(400).json({ mensagem: "Convite inválido, expirado ou já utilizado." });
        }

        const novoRecrutador = await RecrutadorModel.criar({
            nome: nome,
            email: conviteValido.email_convidado,
            senha: senha,
            empresa_id: conviteValido.empresa_id,
            permissao_id: conviteValido.permissao_id 
        });

        await ConviteModel.marcarComoAceito(token);

        res.status(201).json({
            mensagem: "Recrutador cadastrado com sucesso via convite!",
            recrutador: novoRecrutador
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao processar o convite." });
    }
    
};
const listarConvites = async (req, res) => {
    try {
        const { empresa_id } = req.params;

        if (!empresa_id) {
            return res.status(400).json({ mensagem: "O ID da empresa é obrigatório." });
        }

        const convites = await ConviteModel.listarPorEmpresa(empresa_id);

        res.status(200).json({
            mensagem: "Convites recuperados com sucesso.",
            total: convites.length,
            convites: convites
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao listar os convites." });
    }
};

module.exports = { gerarConvite, aceitarConvite, listarConvites };