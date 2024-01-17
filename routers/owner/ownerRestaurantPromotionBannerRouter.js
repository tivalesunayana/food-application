const express = require("express");
const router = express.Router();
const ownerRestaurantPromotionBannerController = require("../../controllers/owner/ownerRestaurantPromotionBannerController");
const { protect } = require("../../controllers/owner/ownerAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/restaurant/promotion/banner")
  .post(protect, ownerRestaurantPromotionBannerController.createPromotionBanner)
  .patch(
    protect,
    imageUpload.single("image"),
    ownerRestaurantPromotionBannerController.uploadPromotionBanner
  );

module.exports = router;
