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
  generateVerificationToken,
  accountVerification,
  forgotPasswordToken,
  passwordReset,
  profilePhotoUploadController,
} = require('../../controllers/users/userController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  profilePhotoResize,
} = require('../../middlewares/uploads/photoUpload');

const userRoutes = express.Router();

userRoutes.post(
  '/generate-verify-email-token',
  authMiddleware,
  generateVerificationToken
);
userRoutes.put(
  '/profilephoto-upload',
  authMiddleware,
  photoUpload.single('image'),
  profilePhotoResize,
  profilePhotoUploadController
);
userRoutes.put('/verify-account', authMiddleware, accountVerification);

userRoutes.put('/block-user/:id', authMiddleware, blockUser);
userRoutes.put('/unblock-user/:id', authMiddleware, unBlockUser);
userRoutes.get('/profile/:id', authMiddleware, userProfile);

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.put('/password', authMiddleware, updateUserPassword);
userRoutes.post('/forgot-password-token', forgotPasswordToken);
userRoutes.put('/reset-password', passwordReset);
userRoutes.put('/follow', authMiddleware, followUser);
userRoutes.put('/unfollow', authMiddleware, unfollowUser);

userRoutes.get('/:id', fetchUserDetails);
userRoutes.put('/', authMiddleware, updateUser);
userRoutes.delete('/:id', authMiddleware, deleteUser);
userRoutes.get('/', authMiddleware, getUsers);

module.exports = userRoutes;
