const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const preOrderSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    orderId: { type: Number },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    coupon: { type: Schema.ObjectId, ref: "Coupon" },
    payment: { type: Schema.ObjectId, ref: "Payment" },
    orderItems: [{ type: Schema.ObjectId, ref: "OrderItem" }],
    customerAddress: { type: Schema.ObjectId, ref: "Address" },

    paymentMode: { type: String, enum: ["kotak", "COD"] },
    paymentStatus: {
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
    grandTotalPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalTaxes: {
      type: Number,
      default: 0,
    },
    deliveryTip: { type: Number, default: 0 },

    grandTotalTaxes: {
      type: Number,
      default: 0,
    },
    packagingCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    deliveryBoyShare: {
      type: Number,
      default: 0,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    duration: {
      type: Number,
    },
    distance: {
      type: Number,
    },
    petPoojaData: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const PreOrder = mongoose.model("PreOrder", preOrderSchema);

module.exports = PreOrder;
