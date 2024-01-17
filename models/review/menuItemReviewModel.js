const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const itemReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    items: { type: Schema.ObjectId, ref: "Items" },
    customer: { type: Schema.ObjectId, ref: "Customer" },
    orderItem: { type: Schema.ObjectId, ref: "OrderItem" },
    updated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ItemReview = mongoose.model("ItemReview", itemReviewSchema);

module.exports = ItemReview;
