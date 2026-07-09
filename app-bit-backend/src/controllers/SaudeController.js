const SaudeModel = require('../models/SaudeModel');

const verificarSaude = async (req, res) => {
    res.status(200).json({
        status: "ok",
        servico: "App BiT API",
        horaServidor: new Date().toISOString(),
        uptimeSegundos: Math.floor(process.uptime())
    });
};

const verificarSaudeBanco = async (req, res) => {
    try {
        const banco = await SaudeModel.verificarBanco();
        const status = banco.conectado ? "ok" : "erro";
        const mensagem = banco.conectado
            ? "Serviço e banco operacionais"
            : `Falha na conexão com o banco: ${banco.erro}`;

        // Persiste o resultado da verificação no histórico (LogSaude).
        // Se o próprio banco estiver fora, o registro é ignorado silenciosamente.
        try {
            await SaudeModel.registrarLog({
                status,
                banco_conectado: banco.conectado,
                tempo_resposta_ms: banco.tempoRespostaMs,
                mensagem
            });
        } catch (erroLog) {
            console.error("Não foi possível gravar o log de saúde:", erroLog.message);
        }

        const corpo = {
            status,
            servico: "App BiT API",
            banco,
            horaServidor: new Date().toISOString()
        };

        return res.status(banco.conectado ? 200 : 503).json(corpo);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao verificar a saúde do serviço." });
    }
};

const listarHistorico = async (req, res) => {
    try {
        const limite = Math.min(Number(req.query.limite) || 20, 100);
        const logs = await SaudeModel.listarLogs(limite);
        res.status(200).json(logs);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar o histórico de saúde." });
    }
};

module.exports = { verificarSaude, verificarSaudeBanco, listarHistorico };
