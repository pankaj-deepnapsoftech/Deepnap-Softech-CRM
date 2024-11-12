const { TryCatch, ErrorHandler } = require("../../helpers/error");
const expenseCategoryModel = require("../../models/expenseCategory");

const createCategory = TryCatch(async (req, res) => {
  const { name, description } = req.body;

  const category = await expenseCategoryModel.create({
    categoryname: name,
    description,
    creator: req.user.id,
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Category has been created successfully",
    category: category,
  });
});

const editCategory = TryCatch(async (req, res) => {
  const { categoryId, name, description } = req.body;

  const isCategoryExists = await expenseCategoryModel.findById(categoryId);
  if (!isCategoryExists) {
    throw new ErrorHandler("Category doesn't exists", 400);
  }

  const updatedCategory = await expenseCategoryModel.findOneAndUpdate(
    { _id: categoryId },
    { name, description },
    { new: true }
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "Category has been updated successfully",
    updatedCategory: updatedCategory,
  });
});

const deleteCategory = TryCatch(async (req, res) => {
  const { categoryId } = req.body;

  const isCategoryExists = await expenseCategoryModel.findById(categoryId);
  if (!isCategoryExists) {
    throw new ErrorHandler("Category doesn't exists", 400);
  }
  if (req.user.role !== "Super Admin") {
    throw new Error("You are not allowed to delete this expense category", 401);
  }

  const deletedCategory = await expenseCategoryModel.deleteOne({
    _id: categoryId,
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Category has been deleted successfully",
  });
});

const categoryDetails = TryCatch(async (req, res) => {
  const { categoryId } = req.body;

  const category = await expenseCategoryModel.findById(categoryId);
  if (!category) {
    throw new ErrorHandler("Category doesn't exists", 400);
  }

  res.status(200).json({
    status: 200,
    success: true,
    category: category,
  });
});

const allCategories = TryCatch(async (req, res) => {
  const { page = 1 } = req.body;

  const categories = await expenseCategoryModel
    .find()
    .sort({ createdAt: -1 })
    .populate("creator", "name");
  res.status(200).json({
    status: 200,
    success: true,
    categories: categories,
  });
});

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  categoryDetails,
  allCategories
};
