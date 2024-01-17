const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, upperCase: true, unique: true, required: true },
    couponType: {
      type: String,
      enum: ["admin", "customer", "restaurant"],
      required: true,
    },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    freeDelivery: { type: Boolean, default: false },
    freeDeliveryApplyCount: { type: Number, default: 1 },
    applyCount: { type: Number, default: 1 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    totalCount: { type: Number, default: 0 },
    expire: { type: Date, required: true },
    percentage: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    newCustomer: { type: Boolean, default: false },
    minValue: { type: Number, default: 0 },
    visible: { type: Boolean, default: false },
    image: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
