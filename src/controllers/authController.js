const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const OAUTH_CLIENTS = {
    'task-manager-app': 'umaia_super_secret_password'
};

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Registar novo utilizador (rota pública)
 *     tags: [OAuth2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Novo Utilizador
 *               email:
 *                 type: string
 *                 example: novo@email.com
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 *       409:
 *         description: Email já em uso
 */
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email e password são obrigatórios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: 'Email já está em uso' });
                    }
                    return res.status(500).json({ error: 'Erro ao registar utilizador' });
                }
                res.status(201).json({ id: results.insertId, name, email });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
};

/**
 * @openapi
 * /oauth/token:
 *   post:
 *     summary: Emitir token de acesso (OAuth2 - Resource Owner Password Credentials Flow)
 *     tags: [OAuth2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [grant_type, username, password, client_id, client_secret]
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: password
 *               username:
 *                 type: string
 *                 example: igor1@email.com
 *               password:
 *                 type: string
 *                 example: "123"
 *               client_id:
 *                 type: string
 *                 example: task-manager-app
 *               client_secret:
 *                 type: string
 *                 example: umaia_super_secret_password
 *               scope:
 *                 type: string
 *                 example: "read write"
 *     responses:
 *       200:
 *         description: Token emitido com sucesso no formato OAuth2
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Credenciais inválidas
 */
exports.token = (req, res) => {
    const { grant_type, username, password, client_id, client_secret, scope } = req.body;

    if (!grant_type || grant_type !== 'password') {
        return res.status(400).json({
            error: 'unsupported_grant_type',
            error_description: 'O parâmetro grant_type deve ser "password"'
        });
    }

    if (!client_id || !client_secret) {
        return res.status(400).json({
            error: 'invalid_client',
            error_description: 'client_id e client_secret são obrigatórios'
        });
    }

    if (!OAUTH_CLIENTS[client_id] || OAUTH_CLIENTS[client_id] !== client_secret) {
        return res.status(401).json({
            error: 'invalid_client',
            error_description: 'client_id ou client_secret inválidos'
        });
    }

    if (!username || !password) {
        return res.status(400).json({
            error: 'invalid_request',
            error_description: 'username e password são obrigatórios'
        });
    }

    // Busca apenas por email, depois valida a password com bcrypt
    db.query('SELECT * FROM users WHERE email = ?', [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'server_error', error_description: 'Erro interno' });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: 'invalid_grant',
                error_description: 'Credenciais do utilizador inválidas'
            });
        }

        const user = results[0];

        // Comparação segura da password com bcrypt
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({
                error: 'invalid_grant',
                error_description: 'Credenciais do utilizador inválidas'
            });
        }

        const expiresIn = 3600;
        const grantedScope = scope || 'read write';

        const access_token = jwt.sign(
            { id: user.id, name: user.name, client_id, scope: grantedScope },
            process.env.JWT_SECRET || 'umaia_secret_2024',
            { expiresIn }
        );

        console.log(`\n========== OAuth2 TOKEN EMITIDO ==========`);
        console.log(`Cliente:    ${client_id}`);
        console.log(`Utilizador: ${user.name} (ID: ${user.id})`);
        console.log(`Scope:      ${grantedScope}`);
        console.log(`==========================================\n`);

        res.json({
            access_token,
            token_type: 'Bearer',
            expires_in: expiresIn,
            scope: grantedScope
        });
    });
};