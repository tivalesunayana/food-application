const express = require("express");
const router = express.Router();
const ownerReviewController = require("../../controllers/owner/ownerReviewController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/restaurant/review")
  .get(protect, ownerReviewController.getRestaurantReview);
router
  .route("/restaurant/app/review")
  .post(protect, ownerReviewController.createRestaurantAppReview);

router
  .route("/delivery/partner/review")
  .post(protect, ownerReviewController.createDeliveryPartnerByRestaurantReview);

module.exports = router;
