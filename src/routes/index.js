const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const categoryController = require('../controllers/categoryController');

router.post('/login', authController.login);
router.get('/tasks', authMiddleware, taskController.getTasks);
router.post('/tasks', authMiddleware, taskController.createTask);
router.put('/tasks/:id', authMiddleware, taskController.updateTask);
router.get('/categories', authMiddleware, categoryController.getCategories);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

module.exports = router;