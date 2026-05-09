const db = require('../config/db');

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Obter todas as categorias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
exports.getCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
        res.json(results);
    });
};