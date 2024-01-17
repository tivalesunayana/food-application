const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminCouponController = require("../../controllers/admin/adminCouponController");
const { imageUpload } = require("../../config/s3config");

// router
//   .route("/coupon")
//   .post(
//     protect,
//     imageUpload.single("image"),
//   .post(adminCouponController.createCoupon)
//   .patch(protect, adminCouponController.visibleCoupon)
//   .get(protect, adminCouponController.getCoupon);

router
  .route("/coupon")
  .post(
    protect,
    imageUpload.single("image"),
    adminCouponController.createCoupon
  )
  .get(adminCouponController.getCoupon)
  .patch(protect, adminCouponController.visibleCoupon);

router
  .route("/deleteCoupon/:couponId")
  .delete(protect, adminCouponController.deleteCoupon);

// router
//   .route("/coupon")
//   .post(
//     // protect,
//     imageUpload.single("image"),
//     adminCouponController.createCoupon
// //   )
// .patch(protect, adminCouponController.visibleCoupon)
// .get(protect, adminCouponController.getCoupon);

router
  .route("/editCoupon/:couponId")

  .patch(protect, adminCouponController.editCoupon);

module.exports = router;
