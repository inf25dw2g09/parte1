const db = require('../config/db');
const jwt = require('jsonwebtoken');


/**
 * @openapi
 * /oauth/token:
 *   post:
 *     summary: Emitir token de acesso (OAuth2 - Resource Owner Password Flow)
 *     tags:
 *       - OAuth2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grant_type
 *               - username
 *               - password
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: password
 *               username:
 *                 type: string
 *                 example: igor1@email.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Token emitido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                   example: Bearer
 *                 expires_in:
 *                   type: integer
 *                   example: 3600
 *       400:
 *         description: grant_type inválido
 *       401:
 *         description: Credenciais inválidas
 */
exports.token = (req, res) => {
    const { grant_type, username, password } = req.body;

    if (!grant_type || grant_type !== 'password') {
        return res.status(400).json({
            error: 'unsupported_grant_type',
            error_description: 'grant_type deve ser "password"' 
        });
    }

    if (!username || !password) {
        return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Username e password são obrigatórios' 
        });
    }

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    error: 'invalid_grant',
                    error_description: 'Credenciais inválidas' });
            }

            const user = results[0];
            const expiresIn = 3600; // 1 hora
            const access_token = jwt.sign(
                { id: user.id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn }
            );

            console.log(`✅ Login bem-sucedido para ${user.name} (ID: ${user.id})`);

            res.json({ access_token, token_type: 'Bearer', expires_in: expiresIn });
        }
    );
};


