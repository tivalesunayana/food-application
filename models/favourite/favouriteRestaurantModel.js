const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const favouriteRestaurantSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    restaurants: [{ type: Schema.ObjectId, ref: "Restaurant" }],
  },
  {
    timestamps: true,
  }
);

const FavouriteRestaurant = mongoose.model(
  "FavouriteRestaurant",
  favouriteRestaurantSchema
);

module.exports = FavouriteRestaurant;
