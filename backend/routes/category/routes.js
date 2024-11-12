const express = require('express');
const { createCategory, editCategory, deleteCategory, categoryDetails, allCategories } = require('../../controllers/category/controller');
const { createCategoryValidator, validateHandler, editCategoryValidator, deleteCategoryValidator, categoryDetailsValidator } = require('../../validators/category/validator');
const router = express.Router();

router.post('/create-category', createCategoryValidator(), validateHandler, createCategory);
router.post('/edit-category', editCategoryValidator(), validateHandler, editCategory);
router.post('/delete-category', deleteCategoryValidator(), validateHandler, deleteCategory);
router.post('/category-details', categoryDetailsValidator(), validateHandler, categoryDetails);
router.post('/all-categories', allCategories);
// router.get('/all-colors', getAllColors);

module.exports = router;