const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminTicketController = require("../../controllers/admin/adminTicketController");

router
  .route("/restaurant/ticket")
  .get(protect, adminTicketController.getRestaurantTickets)
  .post(protect, adminTicketController.updateRestaurantTickets);

router
  .route("/delivery/partner/ticket")
  .get(protect, adminTicketController.getDeliveryPartnerTickets)
  .post(protect, adminTicketController.markedSolvedDeliveryPartnerTicket);
module.exports = router;
