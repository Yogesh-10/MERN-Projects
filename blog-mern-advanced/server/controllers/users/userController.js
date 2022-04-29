const crypto = require('crypto');
const nodemailer = require('nodemailer');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../../config/token/generateToken');
const User = require('../../models/user/UserModel');
const validateMongodbId = require('../../utils/validateMongodbID');

/*
@Author - Yogesh
@Desc   - Register a user
@Route  - POST/api/users/register
@Access - Public
*/
const registerUser = expressAsyncHandler(async (req, res) => {
  const userAlreadyExists = await User.findOne({ email: req?.body?.email });

  if (userAlreadyExists) throw new Error('User already exists');
  try {
    //Register user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Login user
@Route  - POST/api/users/login
@Access - Public
*/
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const userFound = await User.findOne({ email });

  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Login Credentials');
  }
});

/*
@Author - Yogesh
@Desc   - get all users
@Route  - GET/api/users/
@Access - Private
*/
const getUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Delete a user
@Route  - POST/api/users/:id
@Access - Private
*/
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch a user details
@Route  - GET/api/users/:id
@Access - Public
*/
const fetchUserDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch a user profile
@Route  - GET/api/users/profile/:id
@Access - Private
*/
const userProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Update user
@Route  - PUT/api/users/:id
@Access - Private
*/
const updateUser = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(user);
});

/*
@Author - Yogesh
@Desc   - Update Password
@Route  - PUT/api/users/password
@Access - Private
*/
const updateUserPassword = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

/*
@Author - Yogesh
@Desc   - Follow User
@Route  - PUT/api/users/follow
@Access - Private
*/
const followUser = expressAsyncHandler(async (req, res) => {
  //1.Find the user you want to follow and update it's followers field
  //2. Update the login user following field
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if the login id exist
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error('You have already followed this user');

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.json('You have successfully followed this user');
});

/*
@Author - Yogesh
@Desc   - UnFollow User
@Route  - PUT/api/users/unfollow
@Access - Private
*/
const unfollowUser = expressAsyncHandler(async (req, res) => {
  const { unFollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unFollowId },
    },
    { new: true }
  );

  res.json('You have successfully unfollowed this user');
});

/*
@Author - Yogesh
@Desc   - Block User
@Route  - PUT/api/users/block-user
@Access - Private
*/
const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );

  res.json(user);
});

/*
@Author - Yogesh
@Desc   - UnBlock User
@Route  - PUT/api/users/unblock-user
@Access - Private
*/
const unBlockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );

  res.json(user);
});

/*
@Author - Yogesh
@Desc   - Generate Verification Token for account-verification and send email to verify account
@Route  - POST/api/users/generate-verify-email-token
@Access - Private
*/
const generateVerificationToken = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    //Generate token
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();

    const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    transporter.sendMail({
      from: '"Blog-MERN-Advanced" <blog-mern-advanced@gmail.com>', // sender address
      to: 'allan.ankunding97@ethereal.email',
      subject: 'My first Node js email sending',
      html: resetURL,
    });

    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Verify-Token via Email received and update the user to verified account
@Route  - POST/api/users/verify-account
@Access - Private
*/
const accountVerification = expressAsyncHandler(async (req, res) => {
  const { verificationToken } = req.body;
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  //find this user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date.now() },
  });

  if (!userFound) throw new Error('Token expired, try again later');

  //update the accountverified property to true and remove verificationToken and Expiration from DB(by setting undefined - it will be removed)
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();

  res.json(userFound);
});

/*
@Author - Yogesh
@Desc   - create forgotpassword-token and send it via email to reset the password
@Route  - POST/api/users/forgot-password-token
@Access - Private/email
*/
const forgotPasswordToken = expressAsyncHandler(async (req, res) => {
  //find the user by email
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error('User Not Found');

  try {
    // Create token
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">Click to Reset</a>`;
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    transporter.sendMail({
      from: '"Blog-MERN-Advanced" <blog-mern-advanced@gmail.com>', // sender address
      to: 'allan.ankunding97@ethereal.email',
      subject: 'Reset Password',
      html: resetURL,
    });

    res.json({
      msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Reset the password via email received
@Route  - PUT/api/users/reset-password
@Access - Private
*/
const passwordReset = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  //find this user by token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error('Token Expired, try again later');

  //Update/change the password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json(user);
});

module.exports = {
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
};
