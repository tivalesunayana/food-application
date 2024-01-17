const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category/categoryController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router.route("/food/categories").get(protect, categoryController.category);

module.exports = router;
