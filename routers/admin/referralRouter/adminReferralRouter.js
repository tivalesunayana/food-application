const express = require("express");

const router = express.Router();
const { protect } = require("../../../controllers/admin/adminAuthController");
const adminReferralController = require("../../../controllers/admin/referralController/adminReferralController");

router
  .route("/allReferrals")
  .get(protect, adminReferralController.getAllReferrals);

module.exports = router;
