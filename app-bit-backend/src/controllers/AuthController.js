const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RecrutadorModel = require('../models/RecrutadorModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
        }

        const recrutador = await RecrutadorModel.buscarPorEmail(email);
        if (!recrutador) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const senhaValida = await bcrypt.compare(senha, recrutador.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const payload = {
            id: recrutador.recrutador_id,
            empresa_id: recrutador.empresa_id,
            permissao_id: recrutador.permissao_id
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token: token,
            usuario: {
                nome: recrutador.nome,
                email: recrutador.email,
                permissao_id: recrutador.permissao_id
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao realizar login." });
    }
};

module.exports = { login };