const mongoose = require("mongoose");
Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const restaurantStatusModelSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
  },
  {
    timestamps: true,
  }
);

const RestaurantStatusModel = mongoose.model(
  "RestaurantStatusModel",
  restaurantStatusModelSchema
);

module.exports = RestaurantStatusModel;
