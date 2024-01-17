const express = require("express");
const router = express.Router();
const brandController = require("../../controllers/brand/brandController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router.route("/brands").get(protect, brandController.brand);

module.exports = router;
