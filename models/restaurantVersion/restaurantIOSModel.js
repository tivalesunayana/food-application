const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const restaurantIOSSchema = new mongoose.Schema(
  {
    currentAppVersion: { type: Schema.ObjectId, ref: "MenuItem" },
    unsupportedAppVersion: { type: Schema.ObjectId, ref: "MenuItem" },
  },
  {
    timestamps: true,
  }
);

const RestaurantIOS = mongoose.model("RestaurantIOS", restaurantIOSSchema);

module.exports = RestaurantIOS;
