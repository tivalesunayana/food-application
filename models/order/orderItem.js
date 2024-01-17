const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const orderItemSchema = new mongoose.Schema(
  {
    item: { type: Schema.ObjectId, ref: "Items" },
    order: { type: Schema.ObjectId, ref: "Order" },
    itemReview: { type: Schema.ObjectId, ref: "ItemReview" },
    itemTitle: { type: String },
    addOnIds: [{ type: String }],
    variation: { type: String },
    addOnsTitles: [{ type: String }],
    variationTitle: { type: String },
    price: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    couponDiscountPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    totalTax: {
      type: Number,
    },
  
    quantity: { type: Number },
  },
  {
    timestamps: true,
  }
);
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
