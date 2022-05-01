const express = require('express');
const {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCateory,
} = require('../../controllers/category/categoryController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const categoryRoutes = express.Router();

categoryRoutes.post('/', authMiddleware, createCategory);
categoryRoutes.get('/', authMiddleware, fetchCategories);
categoryRoutes.get('/:id', authMiddleware, fetchCategory);
categoryRoutes.put('/:id', authMiddleware, updateCategory);
categoryRoutes.delete('/:id', authMiddleware, deleteCateory);

module.exports = categoryRoutes;
