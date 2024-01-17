const express = require("express");
const {
  protect,
} = require("../../controllers/customer/customerAuthController");

const {
  RedeemReward,
  // getRewardHistoryy,
  getSingleCustomerRewardHistory,
} = require("../../controllers/customer/customerRedeemRewarController");
const router = express.Router();

router.route("/redeemReward").post(protect, RedeemReward);
// router.route("/getRewardHistory").get(protect, getRewardHistoryy);
router.route("/rewardHistory").get(protect, getSingleCustomerRewardHistory);

module.exports = router;
