const express = require('express');
const { createProduct, editProduct, deleteProduct, productDetails, allProducts } = require('../../controllers/product/controller');
const { createProductValidator, validateHandler, editProductValidator, deleteProductValidator, productDetailsValidator } = require('../../validators/product/validator');
const router = express.Router();

router.post("/create-product", createProductValidator(), validateHandler, createProduct);
router.post("/edit-product", editProductValidator(), validateHandler, editProduct);
router.post("/delete-product", deleteProductValidator(), validateHandler, deleteProduct);
router.post("/product-details", productDetailsValidator(), validateHandler, productDetails);
router.post("/all-products", allProducts);

module.exports = router;