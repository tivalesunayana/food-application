const express = require("express");
const router = express.Router();
const cuisineController = require("../../controllers/cuisine/cuisineController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router.route("/cuisines").get(protect, cuisineController.cuisine);

module.exports = router;
