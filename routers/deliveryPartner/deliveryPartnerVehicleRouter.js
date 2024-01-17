const express = require("express");
const router = express.Router();
const deliveryPartnerVehicleController = require("../../controllers/deliveryPartner/deliveryPartnerVehicleController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/vehicle")
  .post(protect, deliveryPartnerVehicleController.createDeliveryPartnerVehicle)
  .patch(
    protect,
    imageUpload.array("images"),
    deliveryPartnerVehicleController.uploadDeliveryPartnerVehicleDocument
  );

module.exports = router;
