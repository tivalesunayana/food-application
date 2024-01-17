const express = require("express");

const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminRedeemRewardController = require("../../controllers/admin/adminRedeemRewardController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/createRedeemRwards")
  .post(protect, adminRedeemRewardController.createReward)
  .put(
    protect,
    imageUpload.single("image"),
    adminRedeemRewardController.uploadRewardImage
  );

router
  .route("/deleteReward/:rewardId")
  .delete(protect, adminRedeemRewardController.deleteReward);

router
  .route("/editReward/:rewardId")
  .patch(protect, adminRedeemRewardController.editReward);

router
  .route("/allRewards")
  .get(protect, adminRedeemRewardController.getRedeemReward);

router
  .route("/customerRedeemedRewards")
  .get(protect, adminRedeemRewardController.getCustomerRewardedHistory);

router
  .route("/deleteCustomerRewardHistory")
  .delete(protect, adminRedeemRewardController.deleteRewardHistory);

router
  .route("/updateDeliveryStatus/:id")
  .patch(protect, adminRedeemRewardController.updateDeliveryStatus);

module.exports = router;
