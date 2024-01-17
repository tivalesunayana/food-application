const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    order: {
      type: Schema.ObjectId,
      ref: "Order",
    },
    preOrder: {
      type: Schema.ObjectId,
      ref: "PreOrder",
    },
    paymentMode: { type: String, enum: ["kotak", "COD"] },
    status: {
      type: String,
      enum: [
        "Failed",
        "Pending",
        "Paid",
        "COD",
        "Refunded-In-Progress",
        "Refunded",
      ],
      default: "Pending",
    },
    razorpayOrder: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    customer: { type: Schema.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
