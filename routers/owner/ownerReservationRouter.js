const express = require("express");
const router = express.Router();
const ownerReservationController = require("../../controllers/owner/ownerReservationController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/reservation")
  .get(protect, ownerReservationController.getAllReservation);

router
  .route("/reservation/switch")
  .post(protect, ownerReservationController.reservationSwitch);
router
  .route("/reservation/date")
  .post(protect, ownerReservationController.getByDateReservation);
router
  .route("/reservation/reject")
  .post(protect, ownerReservationController.rejectReservation);
router
  .route("/reservation/confirm")
  .post(protect, ownerReservationController.confirmedReservation);

module.exports = router;
