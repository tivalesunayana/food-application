const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    customer: { type: Schema.ObjectId, ref: "Customer" },
    order: { type: Schema.ObjectId, ref: "Order" },
    updated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const RestaurantReview = mongoose.model(
  "RestaurantReview",
  restaurantReviewSchema
);

module.exports = RestaurantReview;
