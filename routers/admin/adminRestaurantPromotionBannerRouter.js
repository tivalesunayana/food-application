const express = require("express");
const router = express.Router();
const adminRestaurantPromotionBannerController = require("../../controllers/admin/adminRestaurantPromotionBannerController");
const { protect } = require("../../controllers/admin/adminAuthController");

router
  .route("/restaurants/promotion/banner")
  .get(
    protect,
    adminRestaurantPromotionBannerController.getAllUnapprovedPromotionBanner
  )
  .post(
    protect,
    adminRestaurantPromotionBannerController.approvePromotionBanner
  );

module.exports = router;
