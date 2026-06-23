const EmpresaModel = require('../models/EmpresaModel');

class EmpresaController {
    async criarEmpresa(req, res) {
        try {
            const { nome, razao_social, cnpj } = req.body;

            if (!nome || !razao_social || !cnpj) {
                return res.status(400).json({ 
                    erro: "Dados incompletos. Os campos 'nome', 'razao_social' e 'cnpj' são obrigatórios." 
                });
            }

            const empresaExistente = await EmpresaModel.buscarPorCnpj(cnpj);

            if (empresaExistente) {
                return res.status(409).json({ 
                    erro: "Conflito: Já existe uma conta corporativa cadastrada com este CNPJ." 
                });
            }

            const novaEmpresa = await EmpresaModel.criar({ nome, razao_social, cnpj });

            return res.status(201).json({
                mensagem: "Conta corporativa criada com sucesso!",
                empresa: novaEmpresa
            });

        } catch (erro) {
            console.error("Erro no EmpresaController:", erro);
            return res.status(500).json({ erro: "Erro interno no servidor ao criar a empresa." });
        }
    }
}

module.exports = new EmpresaController();