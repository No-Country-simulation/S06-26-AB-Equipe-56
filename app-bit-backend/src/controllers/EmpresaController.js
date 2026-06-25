const EmpresaModel = require('../models/EmpresaModel');

const listarEmpresas = async (req, res) => {
    try {
        const empresas = await EmpresaModel.listarTodas();
        res.status(200).json(empresas);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro interno no servidor ao buscar empresas" });
    }
};

const criarEmpresa = async (req, res) => {
    try {
        const novaEmpresa = await EmpresaModel.criar(req.body);
        res.status(201).json(novaEmpresa);
    } catch (erro) {
        if (erro.message === "CNPJ_JA_EXISTENTE") {
            return res.status(409).json({ mensagem: "Este CNPJ já está registrado em nossa base." });
        }
        res.status(500).json({ mensagem: "Erro ao cadastrar empresa." });
    }
};
const buscarMeuPerfil = async (req, res) => {
    try {
        const empresa_id = req.usuarioLogado.empresa_id;
        const empresa = await EmpresaModel.buscarPorId(empresa_id);

        if (!empresa) {
            return res.status(404).json({ mensagem: "Empresa não encontrada." });
        }

        res.status(200).json(empresa);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar dados da empresa." });
    }
};
module.exports = { listarEmpresas, criarEmpresa, buscarMeuPerfil };