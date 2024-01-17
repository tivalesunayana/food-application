const express = require("express");
const router = express.Router();
const categoryController = require("../../../controllers/category/categoryController");
const { protect } = require("../../../controllers/admin/adminAuthController");
const { imageUpload } = require("../../../config/s3config");
router
  .route("/category")
  .post(protect, categoryController.createCategory)
  .get(protect, categoryController.allCategory)
  .delete(protect, categoryController.categoryDelete);

router
  .route("/category/:categoryId")
  .post(
    protect,
    imageUpload.single("image"),
    categoryController.uploadCategoryImage
  )
  .patch(protect, categoryController.updateCategoryVisible);

module.exports = router;
