const express = require('express');
const {
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
} = require('../../controllers/posts/postController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  postImgResize,
} = require('../../middlewares/uploads/photoUpload');

const postRoutes = express.Router();

postRoutes.post(
  '/',
  authMiddleware,
  photoUpload.single('image'),
  postImgResize,
  createPost
);

postRoutes.get('/:id', fetchPost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.delete('/:id', authMiddleware, deletePost);
postRoutes.get('/', fetchPosts);

module.exports = postRoutes;
