const db = require('../config/db');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Obter o meu perfil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do utilizador autenticado
 */
exports.getUsers = (req, res) => {
    db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao procurar utilizador' });
        res.json(results);
    });
};

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obter utilizador com as suas tarefas (relação 1:N)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilizador com lista de tarefas
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Utilizador não encontrado
 */
exports.getUserById = (req, res) => {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ message: 'Não tens permissão para ver este utilizador' });
    }

    db.query('SELECT id, name, email FROM users WHERE id = ?', [id], (err, userResults) => {
        if (err) return res.status(500).json({ error: 'Erro ao procurar utilizador' });
        if (userResults.length === 0) return res.status(404).json({ message: 'Utilizador não encontrado' });

        const user = userResults[0];

        db.query('SELECT id, title, description, status FROM tasks WHERE user_id = ?', [id], (err2, taskResults) => {
            if (err2) return res.status(500).json({ error: 'Erro ao procurar tarefas' });

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                tasks: taskResults
            });
        });
    });
};

/**
 * @openapi
 * /users/{id}/tasks:
 *   get:
 *     summary: Listar tarefas de um utilizador específico (relação 1:N)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tarefas do utilizador com categorias
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Utilizador não encontrado
 */
exports.getUserTasks = (req, res) => {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ message: 'Não tens permissão para ver as tarefas deste utilizador' });
    }

    db.query('SELECT id FROM users WHERE id = ?', [id], (err, userCheck) => {
        if (err) return res.status(500).json({ error: 'Erro interno' });
        if (userCheck.length === 0) return res.status(404).json({ message: 'Utilizador não encontrado' });

        db.query(
            `SELECT t.id, t.title, t.description, t.status,
                    GROUP_CONCAT(c.name SEPARATOR ', ') AS categories
             FROM tasks t
             LEFT JOIN task_categories tc ON t.id = tc.task_id
             LEFT JOIN categories c ON tc.category_id = c.id
             WHERE t.user_id = ?
             GROUP BY t.id`,
            [id],
            (err2, results) => {
                if (err2) return res.status(500).json({ error: 'Erro ao procurar tarefas' });
                res.json(results);
            }
        );
    });
};

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Criar novo utilizador
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         description: Utilizador criado
 *       409:
 *         description: Email já existe
 */
exports.createUser = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email e password são obrigatórios' });
    }

    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email já está em uso' });
                }
                return res.status(500).json({ error: 'Erro ao criar utilizador' });
            }
            res.status(201).json({ id: results.insertId, name, email });
        }
    );
};

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualizar utilizador
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nome Atualizado
 *               email:
 *                 type: string
 *                 example: atualizado@email.com
 *     responses:
 *       200:
 *         description: Utilizador atualizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Utilizador não encontrado
 */
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ message: 'Não tens permissão para editar este utilizador' });
    }

    if (!name || !email) {
        return res.status(400).json({ message: 'name e email são obrigatórios' });
    }

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar utilizador' });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Utilizador não encontrado' });
            res.json({ id, name, email });
        }
    );
};

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Apagar utilizador
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilizador apagado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Utilizador não encontrado
 */
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ message: 'Não tens permissão para apagar este utilizador' });
    }

    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao apagar utilizador' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Utilizador não encontrado' });
        res.json({ message: 'Utilizador apagado com sucesso' });
    });
};