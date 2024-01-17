const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category/categoryController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router.route("/category").get(protect, categoryController.category);

module.exports = router;
