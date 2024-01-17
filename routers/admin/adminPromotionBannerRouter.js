const express = require("express");
const router = express.Router();
const adminPromotionBannerController = require("../../controllers/admin/adminPromotionBannerController");
const { protect } = require("../../controllers/admin/adminAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/promotion/banner")
  .post(protect, adminPromotionBannerController.createPromotionBanner)
  .get(protect, adminPromotionBannerController.getPromotionBanner)
  .patch(
    protect,
    imageUpload.single("image"),
    adminPromotionBannerController.uploadPromotionBanner
  )
  .put(protect, adminPromotionBannerController.visiblePromotionBanner)
  .delete(protect, adminPromotionBannerController.deletePromotionBanner);

module.exports = router;
