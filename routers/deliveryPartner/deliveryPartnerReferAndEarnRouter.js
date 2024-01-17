const express = require("express");
const router = express.Router();

const deliveryPartnerReferAndEarnController = require("../../controllers/deliveryPartner/deliveryPartnerReferAndEarnController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
router
  .route("/referAndEarn")
  .get(protect, deliveryPartnerReferAndEarnController.getReferAndEarnAmount);

//uploadDeliveryPartnerDocument
module.exports = router;
