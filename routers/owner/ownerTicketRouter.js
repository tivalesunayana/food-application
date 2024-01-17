const express = require("express");
const router = express.Router();
const ownerTicketController = require("../../controllers/owner/ownerTicketController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/restaurant/ticket")
  .get(protect, ownerTicketController.getAllTicket)
  .post(protect, ownerTicketController.createTicket)
  .patch(protect, ownerTicketController.satisfactionTicket);

module.exports = router;
