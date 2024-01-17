const express = require("express");
const router = express.Router();

const coustomerCoinController = require("../../controllers/customer/coustomerCoinController");
const {
  protect,
} = require("../../controllers/customer/customerAuthController");

router
  .route("/coin/:customerId")
  .post(protect, coustomerCoinController.createCustomerWinCoins)
  .get(protect, coustomerCoinController.checkForSpin);

router
  .route("/coin/delete")
  .delete(protect, coustomerCoinController.deleteCustomerWinCoins);

router
  .route("/coin/claimCoins/:customerId")
  .post(protect, coustomerCoinController.claimCoins);

module.exports = router;
