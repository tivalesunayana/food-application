const express = require("express");
const router = express.Router();
const customerDeliveryController = require("../../controllers/customer/customerDeliveryController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router
  .route("/delivery/partner/liveLocation/:partnerId")
  .get(protect, customerDeliveryController.deliveryPartnerLiveLocation);

module.exports = router;
