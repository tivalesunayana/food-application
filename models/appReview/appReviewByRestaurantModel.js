const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const appReviewByRestaurantSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
  },
  {
    timestamps: true,
  }
);

const AppReviewByRestaurant = mongoose.model(
  "AppReviewByRestaurant",
  appReviewByRestaurantSchema
);

module.exports = AppReviewByRestaurant;
