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
  const hasCategory = req.query.category;

  try {
    if (hasCategory) {
      const posts = await Post.find({ category: hasCategory })
        .populate('user')
        .populate('comments')
        .sort('-createdAt');

      res.json(posts);
    } else {
      const posts = await Post.find({})
        .populate('user')
        .populate('comments')
        .sort('-createdAt');
      res.json(posts);
    }
  } catch (error) {
    res.json(error);
  }
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
    const post = await Post.findById(id)
      .populate('user')
      .populate('disLikes') //populating likes and dislikes is optional
      .populate('likes')
      .populate('comments');

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

/*
@Author - Yogesh
@Desc   - Like a post or Toggle like if already liked
@Route  - PUT/api/posts/likes
@Access - Private
*/
const toggleAddLikeToPost = expressAsyncHandler(async (req, res) => {
  //1.Find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has liked this post?
  const isLiked = post?.isLiked;
  //4.Check if this user has disliked this post
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  //5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
  }

  //Toggle - Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );

    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );

    res.json(post);
  }
});

/*
@Author - Yogesh
@Desc   - Dislike a post or Toggle Dislike if already liked
@Route  - PUT/api/posts/dislikes
@Access - Private
*/
const toggleAddDislikeToPost = expressAsyncHandler(async (req, res) => {
  //1.Find the post to be disLiked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;
  //4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );

  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    await Post.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  }

  //Toggling - Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );

    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );

    res.json(post);
  }
});

module.exports = {
  deletePost,
  updatePost,
  createPost,
  fetchPosts,
  fetchPost,
  toggleAddDislikeToPost,
  toggleAddLikeToPost,
};
