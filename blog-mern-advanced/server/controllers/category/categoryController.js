const expressAsyncHandler = require('express-async-handler');
const Category = require('../../models/Category/CategoryModel');

/*
@Author - Yogesh
@Desc   - Create Category
@Route  - POST/api/categories
@Access - Private
*/
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch all Categories
@Route  - GET/api/categories
@Access - Private
*/
const fetchCategories = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('user')
      .sort('-createdAt');
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Fetch all Categories
@Route  - GET/api/categories/:id
@Access - Private
*/
const fetchCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id)
      .populate('user')
      .sort('-createdAt');
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Update Category
@Route  - PUT/api/categories/:id
@Access - Private
*/
const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

/*
@Author - Yogesh
@Desc   - Delete Category
@Route  - DELETE/api/categories/:id
@Access - Private
*/
const deleteCateory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);

    res.json({ msg: 'Category deleted' });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  fetchCategories,
  fetchCategory,
  deleteCateory,
};
