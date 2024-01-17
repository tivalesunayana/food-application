const express = require("express");
const router = express.Router();
const deliveryPartnerTicketController = require("../../controllers/deliveryPartner/deliveryPartnerTicketController");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");

router
  .route("/ticket")
  .get(protect, deliveryPartnerTicketController.getTicket)
  .post(protect, deliveryPartnerTicketController.createTicket);

//uploadDeliveryPartnerDocument
module.exports = router;
