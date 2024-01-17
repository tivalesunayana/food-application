const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantOffDataSchema = new mongoose.Schema(
  {
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    openTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const RestaurantOffData = mongoose.model(
  "RestaurantOffData",
  restaurantOffDataSchema
);

module.exports = RestaurantOffData;
