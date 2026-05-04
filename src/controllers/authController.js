const db = require('../config/db');
const jwt = require('jsonwebtoken');


/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login do utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: igor1@email.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const user = results[0];
            const token = jwt.sign(
                { id: user.id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        }
    );
};


