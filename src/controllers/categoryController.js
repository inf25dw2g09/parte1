const db = require('../config/db');

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
exports.getCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar categorias' });
        res.json(results);
    });
};

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags: [Categories]
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
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
exports.getCategoryById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao procurar categoria' });
        if (results.length === 0) return res.status(404).json({ message: 'Categoria não encontrada' });
        res.json(results[0]);
    });
};

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Finanças
 *     responses:
 *       201:
 *         description: Categoria criada
 */
exports.createCategory = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name é obrigatório' });

    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar categoria' });
        res.status(201).json({ id: results.insertId, name });
    });
};

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name é obrigatório' });

    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar categoria' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada' });
        res.json({ id, name });
    });
};

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Apagar categoria
 *     tags: [Categories]
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
 *         description: Categoria apagada
 *       404:
 *         description: Categoria não encontrada
 */
exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao apagar categoria' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada' });
        res.json({ message: 'Categoria apagada com sucesso' });
    });
};