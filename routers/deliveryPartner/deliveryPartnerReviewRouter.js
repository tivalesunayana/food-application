const express = require("express");
const router = express.Router();
const deliveryPartnerReviewController = require("../../controllers/deliveryPartner/deliveryPartnerReviewController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");
router
  .route("/review/customer")
  .post(
    protect,
    deliveryPartnerReviewController.createCustomerByDeliveryPartnerReview
  );
router
  .route("/review/restaurant")
  .post(
    protect,
    deliveryPartnerReviewController.createRestaurantByDeliveryPartnerReview
  );

router
  .route("/performance")
  .get(protect, deliveryPartnerReviewController.performance);

//uploadDeliveryPartnerDocument
module.exports = router;
