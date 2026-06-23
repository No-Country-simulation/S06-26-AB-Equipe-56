const RecrutadorModel = require('../models/RecrutadorModel');

class RecrutadorController {
    async criarRecrutador(req, res) {
        try {
            const { nome, email, senha, empresa_id, permissao_id } = req.body;

            if (!nome || !email || !senha || !empresa_id) {
                return res.status(400).json({ 
                    erro: "Dados incompletos. Os campos 'nome', 'email', 'senha' e 'empresa_id' são obrigatórios." 
                });
            }

            const emailExistente = await RecrutadorModel.buscarPorEmail(email);

            if (emailExistente) {
                return res.status(409).json({ 
                    erro: "Conflito: Já existe um recrutador cadastrado com este e-mail." 
                });
            }

            const novoRecrutador = await RecrutadorModel.criar({ 
                nome, 
                email, 
                senha, 
                empresa_id, 
                permissao_id: permissao_id || 1 
            });

            const { senha: _, ...recrutadorSemSenha } = novoRecrutador;

            return res.status(201).json({
                mensagem: "Recrutador cadastrado com sucesso!",
                recrutador: recrutadorSemSenha
            });

        } catch (erro) {
            console.error("Erro no RecrutadorController:", erro);
            return res.status(500).json({ erro: "Erro interno no servidor ao cadastrar recrutador." });
        }
    }
    async listarRecrutadores(req, res) {
        try {
            const { empresa_id } = req.query; 
            
            const recrutadores = await RecrutadorModel.listarTodos(empresa_id);

            const recrutadoresSeguros = recrutadores.map(recrutador => {
                const { senha, ...resto } = recrutador;
                return resto;
            });

            return res.status(200).json(recrutadoresSeguros);

        } catch (erro) {
            console.error("Erro ao listar recrutadores:", erro);
            return res.status(500).json({ erro: "Erro interno ao buscar recrutadores." });
        }
    }

    async buscarRecrutador(req, res) {
        try {
            const { id } = req.params; 
            
            const recrutador = await RecrutadorModel.buscarPorId(id);

            if (!recrutador) {
                return res.status(404).json({ erro: "Recrutador não encontrado." });
            }

            const { senha, ...recrutadorSeguro } = recrutador;

            return res.status(200).json(recrutadorSeguro);

        } catch (erro) {
            console.error("Erro ao buscar recrutador:", erro);
            return res.status(500).json({ erro: "Erro interno ao buscar recrutador." });
        }
    }
}

module.exports = new RecrutadorController();