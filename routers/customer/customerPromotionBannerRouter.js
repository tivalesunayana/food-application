const express = require("express");
const router = express.Router();
const customerPromotionBannerController = require("../../controllers/customer/customerPromotionBannerController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router
  .route("/promotion/banners")
  .get(
    protect,
    customerPromotionBannerController.getNearestRestaurantPromotionBanner
  );

module.exports = router;
