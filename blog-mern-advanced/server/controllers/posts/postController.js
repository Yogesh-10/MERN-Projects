const fs = require('fs');
const path = require('path');
const expressAsyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const User = require('../../models/user/UserModel');
const Post = require('../../models/post/PostModel');
const validateMongodbId = require('../../utils/validateMongodbID');
const cloudinaryUploadImg = require('../../utils/cloudinary');

/*
@Author - Yogesh
@Desc   - Create Post
@Route  - POST/api/posts
@Access - Private
*/
const createPost = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  //Check for bad words
  const filter = new Filter(); //Bad-Words npm Package
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  //Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });

    throw new Error(
      'Creating Failed because it contains profane words and you have been blocked'
    );
  }

  //1. Get the Path to img
  const localPath = path.join(
    __dirname,
    `../../public/images/posts/${req?.file?.filename}`
  );

  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });

    // Remove uploaded img from local server
    req?.file?.filename && fs.unlinkSync(localPath);

    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch All Posts
@Route  - GET/api/posts
@Access - Private
*/
const fetchPosts = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user');
    res.json(posts);
  } catch (error) {}
});

/*
@Author - Yogesh
@Desc   - Fetch Single Post
@Route  - GET/api/posts
@Access - Private
*/
const fetchPost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findById(id).populate('user');

    //update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Update Post
@Route  - PUT/api/posts/:id
@Access - Private
*/
const updatePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );

    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Delete Post
@Route  - DELETE/api/posts/:id
@Access - Private
*/
const deletePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const post = await Post.findById(id);

  if (!post) throw new Error(`No post with id ${req.params.id}`);

  if (req.user._id.toString() === post.user.toString()) {
    await Post.findByIdAndDelete(id);
    res.json({ msg: `Post deleted with id ${id}` });
  } else {
    res.json({ msg: 'Not allowed to access' });
  }
});

module.exports = {
  deletePost,
  updatePost,
  createPost,
  fetchPosts,
  fetchPost,
};
