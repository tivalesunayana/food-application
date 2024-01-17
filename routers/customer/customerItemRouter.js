const express = require("express");
const router = express.Router();
const customerItemController = require("../../controllers/customer/customerItemController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");

router.route("/items").get(protect, customerItemController.getRestaurantItems);
module.exports = router;
