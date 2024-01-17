const express = require("express");
const router = express.Router();
const tableReservationRestaurantController = require("../../controllers/restaurant/tableReservationRestaurantController");
router
  .route("/reservation/create")
  .post(tableReservationRestaurantController.createReservation);
router
  .route("/reservation/add/slot")
  .post(tableReservationRestaurantController.addSlotReservation);
//

module.exports = router;
