const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const OrderReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    order: { type: Schema.ObjectId, ref: "Order" },
    customer: { type: Schema.ObjectId, ref: "Customer" },
    updated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const OrderReview = mongoose.model("OrderReview", OrderReviewSchema);

module.exports = OrderReview;
