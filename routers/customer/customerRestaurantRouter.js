const express = require("express");
const router = express.Router();
const customerRestaurantController = require("../../controllers/customer/customerRestaurantController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");

router
  .route("/restaurants")
  .get(protect, customerRestaurantController.getRestaurant);

router
  .route("/restaurant")
  .get(protect, customerRestaurantController.getSingleRestaurant);

router
  .route("/restaurants/search")
  .get(protect, customerRestaurantController.searchRestaurants);
router
  .route("/restaurants/filter")
  .post(protect, customerRestaurantController.filterRestaurants);

  router
  .route("/restaurants/item")
  .get(protect, customerRestaurantController.searchRestaurantsItem);
module.exports = router;
