const expressAsyncHandler = require('express-async-handler');
const Comment = require('../../models/comment/CommentModel');
const validateMongodbId = require('../../utils/validateMongodbID');

/*
@Author - Yogesh
@Desc   - Create a comment
@Route  - POST/api/comments
@Access - Private
*/
const createComment = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const { postId, description } = req.body;

  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch all comments
@Route  - GET/api/comments
@Access - Private
*/
const fetchAllComments = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort('-created');
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch single comment
@Route  - GET/api/comments/:id
@Access - Private
*/
const fetchComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Update a comment
@Route  - PUT/api/comments/:id
@Access - Private
*/
const updateComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body?.postId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Delete a comment
@Route  - DELETE/api/comments/:id
@Access - Private
*/
const deleteComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    await Comment.findByIdAndDelete(id);
    res.json({ msg: 'Comment deleted' });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  deleteComment,
  updateComment,
  createComment,
  fetchAllComments,
  fetchComment,
};
