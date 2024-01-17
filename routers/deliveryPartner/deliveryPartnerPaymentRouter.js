const express = require("express");
const router = express.Router();
const deliveryPartnerPaymentController = require("../../controllers/deliveryPartner/deliveryPartnerPaymentController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");

// router
//   .route("/payment")
//   .get(protect, deliveryPartnerPaymentController.deliveryPartnerPayment);

router
  .route("/payment")
  .get(protect, deliveryPartnerPaymentController.currentDeliveryPartnerPayment);

// router
//   .route("/payment/current")
//   .get(protect, deliveryPartnerPaymentController.currentDeliveryPartnerPayment);

router
  .route("/payment/cash")
  .get(protect, deliveryPartnerPaymentController.getCashDepositLog);

module.exports = router;
