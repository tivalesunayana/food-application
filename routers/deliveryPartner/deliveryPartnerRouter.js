const express = require("express");
const router = express.Router();
const deliveryPartnerController = require("../../controllers/deliveryPartner/deliveryPartnerController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");
router
  .route("/image")
  .post(
    protect,
    imageUpload.single("image"),
    deliveryPartnerController.uploadDeliveryPartnerImage
  );
router.route("/address").post(protect, deliveryPartnerController.addAddress);
router.route("/bank").post(protect, deliveryPartnerController.addBankDetail);
router
  .route("/documents")
  .post(
    protect,
    imageUpload.array("images"),
    deliveryPartnerController.uploadDeliveryPartnerDocument
  );
//uploadDeliveryPartnerDocument
module.exports = router;
