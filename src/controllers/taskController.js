const db = require('../config/db');


/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Listar tarefas do utilizador
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *       401:
 *         description: Não autorizado
 */
exports.getTasks = (req, res) => {
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
};

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Criar nova tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Docker
 *               description:
 *                 type: string
 *                 example: Aprender containers
 *               status:
 *                 type: string
 *                 example: pendente
 *     responses:
 *       201:
 *         description: Tarefa criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *       401:
 *         description: Não autorizado
 */
exports.createTask = (req, res) => {
    const { title, description, status } = req.body;

    if(!title || !status) {
        return res.status(400).json({ message: 'Título e status são obrigatórios' });
    }

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
};

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Docker
 *               description:
 *                 type: string
 *                 example: Aprender containers
 *               status:
 *                 type: string
 *                 example: pendente
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *       404:
 *         description: Tarefa não encontrada
 */
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || !status) {
        return res.status(400).json({ message: 'Título e status são obrigatórios' });
    }

    db.query(
        'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, status, id, req.user.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            res.json({
                id,
                title,
                description,
                status
            });
        }
    );
};

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Apagar tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da tarefa a apagar
 *     responses:
 *       200:
 *         description: Tarefa apagada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tarefa não encontrada
 */
exports.deleteTask = (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, req.user.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao apagar tarefa' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }

            res.json({ message: 'Tarefa apagada com sucesso' });
        }
    );
};
