const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'access_denied',
            error_description: 'Token de acesso OAuth2 não fornecido ou formato inválido.' 
        });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'umaia_secret_2024';

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            console.error("❌ Erro na validação do Token OAuth2:", err.message);
            return res.status(403).json({ 
                error: 'invalid_token',
                error_description: 'O token fornecido expirou ou é inválido.' 
            });
        }

        // Injeta os dados decodificados do token no objeto de pedido (req)
        req.user = decodedToken;
        
        // 🌟 CUMPRIMENTO DO REQUISITO: Detalhe na consola a cada pedido recebido
        console.log(`\n--- [PEDIDO RECEBIDO] ---`);
        console.log(`Rota acessada: ${req.method} ${req.originalUrl}`);
        console.log(`Utilizador Autenticado: ${req.user.name} (ID: ${req.user.id})`);
        console.log(`Aplicação Cliente via OAuth2: ${req.user.client_id}`);
        console.log(`Escopos autorizados no Token: ${req.user.scope}`);
        console.log(`-------------------------\n`);

        next();
    });
};