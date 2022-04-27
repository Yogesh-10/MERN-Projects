const express = require('express');
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  fetchUserDetails,
  userProfile,
  updateUser,
  updateUserPassword,
} = require('../../controllers/users/userController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

userRoutes.get('/', authMiddleware, getUsers);
userRoutes.get('/:id', fetchUserDetails);
userRoutes.get('/profile/:id', authMiddleware, userProfile);

userRoutes.put('/password', authMiddleware, updateUserPassword);
userRoutes.put('/:id', authMiddleware, updateUser);

userRoutes.delete('/:id', authMiddleware, deleteUser);

module.exports = userRoutes;
