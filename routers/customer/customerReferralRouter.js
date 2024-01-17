const express = require("express");
const router = express.Router();

const customerAuthController = require("../../controllers/customer/customerAuthController");
const referralAppController = require("../../controllers/customer/referralController");

router.route("/redeemReferral").post(
  customerAuthController.protect,

  referralAppController.addReferredUser
);

router
  .route("/generateReferral")
  .post(
    customerAuthController.protect,
    referralAppController.generateReferralCodes
  );

router
  .route("/referralRecord")
  .get(
    customerAuthController.protect,
    referralAppController.getSingleCustomerReferralRecord
  );
module.exports = router;
