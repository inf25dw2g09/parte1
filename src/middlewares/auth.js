const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verifica se o header existe e se começa com "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Unauthorized',
            error_description: 'Token não fornecido ou formato inválido' 
        });
    }

    const token = authHeader.split(' ')[1];

    // Fallback para o JWT_SECRET para evitar que a API rebente se o .env falhar
    const secret = process.env.JWT_SECRET || 'umaia_secret_2024';

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.error("❌ Erro na verificação do token:", err.message);
            return res.status(403).json({ 
                error: 'invalid_token',
                error_description: 'Token inválido ou expirado' 
            });
        }

        // Injeta os dados do utilizador na requisição para uso nos controllers
        req.user = user;
        
        console.log(`🔐 Acesso autorizado: ${user.name} (ID: ${user.id})`);
        next();
    });
};