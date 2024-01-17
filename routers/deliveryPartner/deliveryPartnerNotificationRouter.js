const express = require("express");
const router = express.Router();
const deliveryPartnerNotificationController = require("../../controllers/deliveryPartner/deliveryPartnerNotificationController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");

router
  .route("/announcement")
  .get(
    protect,
    deliveryPartnerNotificationController.getNotificationForDelivery
  );

//uploadDeliveryPartnerDocument
module.exports = router;
