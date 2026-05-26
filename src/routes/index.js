const express = require('express');
const router = express.Router();

const authController     = require('../controllers/authController');
const taskController     = require('../controllers/taskController');
const userController     = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const authMiddleware     = require('../middlewares/auth');

// OAuth2
router.post('/oauth/token', authController.token);

// Users
router.get   ('/users',           authMiddleware, userController.getUsers);
router.get   ('/users/:id',       authMiddleware, userController.getUserById);
router.get   ('/users/:id/tasks', authMiddleware, userController.getUserTasks);
router.post  ('/users',           authMiddleware, userController.createUser);
router.put   ('/users/:id',       authMiddleware, userController.updateUser);
router.delete('/users/:id',       authMiddleware, userController.deleteUser);

// Tasks
router.get   ('/tasks',     authMiddleware, taskController.getTasks);
router.post  ('/tasks',     authMiddleware, taskController.createTask);
router.put   ('/tasks/:id', authMiddleware, taskController.updateTask);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

// Categories
router.get   ('/categories',     authMiddleware, categoryController.getCategories);
router.get   ('/categories/:id', authMiddleware, categoryController.getCategoryById);
router.post  ('/categories',     authMiddleware, categoryController.createCategory);
router.put   ('/categories/:id', authMiddleware, categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;