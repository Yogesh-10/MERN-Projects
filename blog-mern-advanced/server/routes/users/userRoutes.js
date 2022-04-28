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
  followUser,
  unfollowUser,
  blockUser,
  unBlockUser,
} = require('../../controllers/users/userController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

userRoutes.get('/', authMiddleware, getUsers);
userRoutes.put('/password', authMiddleware, updateUserPassword);

userRoutes.put('/follow', authMiddleware, followUser);
userRoutes.put('/unfollow', authMiddleware, unfollowUser);

userRoutes.put('/block-user/:id', authMiddleware, blockUser);
userRoutes.put('/unblock-user/:id', authMiddleware, unBlockUser);

userRoutes.get('/profile/:id', authMiddleware, userProfile);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);
userRoutes.get('/:id', fetchUserDetails);

module.exports = userRoutes;
