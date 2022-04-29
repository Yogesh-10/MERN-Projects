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
  sendEmail,
} = require('../../controllers/users/userController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const userRoutes = express.Router();

userRoutes.get('/', authMiddleware, getUsers);
userRoutes.get('/:id', fetchUserDetails);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.put('/password', authMiddleware, updateUserPassword);
userRoutes.put('/follow', authMiddleware, followUser);
userRoutes.put('/unfollow', authMiddleware, unfollowUser);
userRoutes.post('/send-email', authMiddleware, sendEmail);

userRoutes.put('/block-user/:id', authMiddleware, blockUser);
userRoutes.put('/unblock-user/:id', authMiddleware, unBlockUser);
userRoutes.get('/profile/:id', authMiddleware, userProfile);

module.exports = userRoutes;
