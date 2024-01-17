const express = require("express");
const router = express.Router();
const deliveryPartnerController = require("../../controllers/deliveryPartner/deliveryPartnerLogController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/login/history")
  .get(protect, deliveryPartnerController.getLogTiming);
router
  .route("/liveLocation/:partnerId")
  .get(protect, deliveryPartnerController.deliveryPartnerLiveLocation);

//uploadDeliveryPartnerDocument
module.exports = router;
