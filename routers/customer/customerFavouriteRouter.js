const express = require("express");
const router = express.Router();
const customerFavouriteController = require("../../controllers/customer/customerFavouriteController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");
router
  .route("/favourite/item")
  .get(protect, customerFavouriteController.getFavouriteMenuItem)
  .post(protect, customerFavouriteController.addMenuItemToFavourite)
  .delete(protect, customerFavouriteController.removeMenuItemToFavourite);
router
  .route("/favourite/restaurant")
  .get(protect, customerFavouriteController.getFavouriteRestaurant)
  .post(protect, customerFavouriteController.addRestaurantToFavourite)
  .delete(protect, customerFavouriteController.removeRestaurantToFavourite);

module.exports = router;
