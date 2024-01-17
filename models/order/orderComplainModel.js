const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const orderComplainSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    order: { type: Schema.ObjectId, ref: "Order" },
    image: { type: String },
    customerTitle: { type: String },
    customerDescription: { type: String },
    restaurantDescription: { type: String },
    complainNo: { type: Number },
    paymentAccept: { type: Boolean, default: false },
    complainStatus: {
      type: String,
      enum: ["created", "accepted", "completed", "rejected"],
      default: "created",
    },
    finalSolution: { type: String },
    refundStatus: { type: String, enum: ["refunded", "pending"] },
    refundId: { type: String },
  },
  {
    timestamps: true,
  }
);

const OrderComplain = mongoose.model("OrderComplain", orderComplainSchema);

module.exports = OrderComplain;
