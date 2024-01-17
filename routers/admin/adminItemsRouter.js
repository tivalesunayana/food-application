const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminItemsController = require("../../controllers/admin/adminItemsController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/item/category")
  .post(protect, adminItemsController.createCategories)
  .patch(protect, adminItemsController.editCategories)
  .delete(protect, adminItemsController.deleteCategories)
  .put(
    protect,
    imageUpload.single("image"),
    adminItemsController.uploadCategoryImage
  );

router
  .route("/variation")
  .post(protect, adminItemsController.createVariations)
  .patch(protect, adminItemsController.editVariations);

router
  .route("/addonGroup")
  .post(protect, adminItemsController.createAddongroups)
  .patch(protect, adminItemsController.editAddongroups);

router
  .route("/item")
  .post(protect, adminItemsController.createItem)
  .patch(protect, adminItemsController.editItem)
  .delete(protect, adminItemsController.deleteItem);

router
  .route("/item/:itemId")
  .patch(protect, adminItemsController.visibleItem)

  .put(
    protect,
    imageUpload.single("image"),
    adminItemsController.uploadItemImage
  );

module.exports = router;
