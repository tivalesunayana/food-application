const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminComplainController = require("../../controllers/admin/adminComplainController");

router
  .route("/complain")
  .post(protect, adminComplainController.refundOrderComplain)
  .get(protect, adminComplainController.getComplain);
router.route("/appReview").get(protect, adminComplainController.viewAppReview);
module.exports = router;
