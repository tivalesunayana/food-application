const express = require("express");
const {
  protect,
} = require("../../controllers/customer/customerAuthController");
const {
  getAvailableRewards,
} = require("../../controllers/customer/rewardController");
const router = express.Router();

router.route("/referralRewards").get(protect, getAvailableRewards);
module.exports = router;
