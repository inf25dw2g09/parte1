const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const auth = require('./src/middlewares/auth');
require('dotenv').config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const app = express();
app.use(express.json());

// --- LIGAÇÃO À BASE DE DADOS ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 🔍 FUNÇÃO DE LIGAÇÃO COM RETRY (Tenta até conseguir ligar)
function connectWithRetry() {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ MySQL ainda não está pronto... a tentar novamente em 3s');
            setTimeout(connectWithRetry, 3000);
        } else {
            console.log('✅ Ligado ao MySQL com sucesso!');
            connection.release();
        }
    });
}

connectWithRetry();

// --- CONFIGURAÇÃO SWAGGER ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: 'API de Gestão de Tarefas para o projeto da UMAIA'
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ================= ROTAS =================

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
 *               password:
 *                 type: string
 */
app.post('/login', (req, res) => {
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
});

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Listar tarefas do utilizador
 *     security:
 *       - bearerAuth: []
 */
app.get('/tasks', auth, (req, res) => {
    db.query(
        'SELECT * FROM tasks WHERE user_id = ?',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao procurar tarefas' });
            }
            res.json(results);
        }
    );
});

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Criar nova tarefa
 *     security:
 *       - bearerAuth: []
 */
app.post('/tasks', auth, (req, res) => {
    const { title, description, status } = req.body;

    db.query(
        'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
        [title, description, status, req.user.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar tarefa' });
            }

            res.status(201).json({
                id: results.insertId,
                title
            });
        }
    );
});

// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API online em http://localhost:${PORT}/api-docs`);
});