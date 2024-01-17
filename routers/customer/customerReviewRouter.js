//
const express = require("express");
const router = express.Router();
const customerReviewController = require("../../controllers/customer/customerReviewController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router
  .route("/restaurant/review")
  .post(protect, customerReviewController.createRestaurantReview)
  .get(protect, customerReviewController.getRestaurantReview);

router
  .route("/menuItem/review")
  .post(protect, customerReviewController.createMenuItemReview)
  .get(protect, customerReviewController.getMenuItemReview);

router
  .route("/order/review")
  .post(protect, customerReviewController.createOrderReview)
  .get(protect, customerReviewController.getOrderReview);

router
  .route("/delivery/partner/review")
  .post(protect, customerReviewController.createDeliveryPartnerReview)
  .get(protect, customerReviewController.getDeliveryPartnerReview);

module.exports = router;
