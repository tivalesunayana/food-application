const express = require("express");
const router = express.Router();
const customerCartController = require("../../controllers/customer/customerCartController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");

router.route("/cart/add").post(protect, customerCartController.addItemToCart);
router.route("/cart/update").post(protect, customerCartController.updateCart);
router
  .route("/cart/remove")
  .delete(protect, customerCartController.deleteCartItem);

router.route("/cart").post(protect, customerCartController.normalCart);

router
  .route("/coupon")
  .get(protect, customerCartController.getCoupon)
  .post(protect, customerCartController.addCouponToCart)
  .delete(protect, customerCartController.removeCoupon);

router
  .route("/couponCheck")
  .get(protect, customerCartController.getCouponCheck);

module.exports = router;
