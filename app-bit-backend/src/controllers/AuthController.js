const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RecrutadorModel = require('../models/RecrutadorModel');
const SaudeModel = require('../models/SaudeModel');

const compararSenha = async (senhaInformada, senhaArmazenada) => {
    if (!senhaArmazenada) return false;

    if (senhaArmazenada.startsWith('$2')) {
        return bcrypt.compare(senhaInformada, senhaArmazenada);
    }

    return senhaInformada === senhaArmazenada;
};

const criarPayloadAutenticacao = (usuario) => {
    const payload = {
        id: usuario.id,
        tipo: usuario.tipo,
        nome: usuario.nome,
        email: usuario.email,
        modulo: usuario.modulo
    };

    if (usuario.empresa_id !== undefined) payload.empresa_id = usuario.empresa_id;
    if (usuario.permissao_id !== undefined) payload.permissao_id = usuario.permissao_id;

    if (usuario.tipo === 'profissional') {
        payload.profissional_id = usuario.profissional_id ?? usuario.id;
        payload.especialidade_id = usuario.especialidade_id;
        payload.crm = usuario.crm;
        payload.ativo = usuario.ativo;
    }

    if (usuario.tipo === 'paciente') {
        payload.paciente_id = usuario.paciente_id ?? usuario.id;
        payload.cpf = usuario.cpf;
        payload.data_nascimento = usuario.data_nascimento;
        payload.altura = usuario.altura;
        payload.peso = usuario.peso;
    }

    return payload;
};

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

        const senhaValida = await compararSenha(senha, recrutador.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const payload = criarPayloadAutenticacao({
            id: recrutador.recrutador_id,
            tipo: 'recrutador',
            nome: recrutador.nome,
            email: recrutador.email,
            modulo: 'rh',
            empresa_id: recrutador.empresa_id,
            permissao_id: recrutador.permissao_id
        });

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                nome: recrutador.nome,
                email: recrutador.email,
                permissao_id: recrutador.permissao_id,
                modulo: 'rh'
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao realizar login." });
    }
};

const loginSaude = async (req, res) => {
    try {
        const { email, senha, tipo } = req.body;
        const tipoUsuario = tipo || (req.path.includes('paciente') ? 'paciente' : 'profissional');

        if (!email || !senha) {
            return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
        }

        let usuario;

        if (tipoUsuario === 'paciente') {
            usuario = await SaudeModel.buscarPacientePorEmail(email);
        } else {
            usuario = await SaudeModel.buscarProfissionalPorEmail(email);
        }

        if (!usuario) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const senhaValida = await compararSenha(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const payload = criarPayloadAutenticacao({
            id: tipoUsuario === 'paciente' ? usuario.paciente_id : usuario.profissional_id,
            tipo: tipoUsuario,
            nome: usuario.nome,
            email: usuario.email,
            modulo: 'saude',
            ...(tipoUsuario === 'paciente'
                ? {
                    paciente_id: usuario.paciente_id,
                    cpf: usuario.cpf,
                    data_nascimento: usuario.data_nascimento,
                    altura: usuario.altura,
                    peso: usuario.peso
                }
                : {
                    profissional_id: usuario.profissional_id,
                    especialidade_id: usuario.especialidade_id,
                    crm: usuario.crm,
                    ativo: usuario.ativo
                })
        });

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                nome: usuario.nome,
                email: usuario.email,
                modulo: 'saude',
                tipo: tipoUsuario,
                ...(tipoUsuario === 'paciente'
                    ? { paciente_id: usuario.paciente_id, cpf: usuario.cpf }
                    : { profissional_id: usuario.profissional_id, especialidade_id: usuario.especialidade_id, crm: usuario.crm })
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno ao realizar login." });
    }
};

module.exports = { login, loginSaude, criarPayloadAutenticacao };