const jwt = require('jsonwebtoken');

const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ 
            mensagem: "Acesso negado. Token de autenticação não fornecido." 
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.permissao_id !== 1) {
            return res.status(403).json({ 
                mensagem: "Acesso restrito. Apenas Administradores podem realizar esta ação." 
            });
        }

        req.usuarioLogado = payload;
        
        next();
    } catch (erro) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado." });
    }
};

module.exports = verificarAdmin;