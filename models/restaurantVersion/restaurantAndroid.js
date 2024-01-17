const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const RestaurantAndroidSchema = new mongoose.Schema(
  {
    currentAppVersion: { type: Schema.ObjectId, ref: "MenuItem" },
    unsupportedAppVersion: { type: Schema.ObjectId, ref: "MenuItem" },
  },
  {
    timestamps: true,
  }
);

const restaurantAndroid = mongoose.model(
  "restaurantAndroid",
  RestaurantAndroidSchema
);

module.exports = restaurantAndroid;
