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
  console.log(req.headers);
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
      lastName: req?.body.lastName,
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
@Desc   - Update Passwod
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

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  fetchUserDetails,
  userProfile,
  updateUser,
  updateUserPassword,
};
