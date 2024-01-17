const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const cartSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    cartItems: [{ type: Schema.ObjectId, ref: "CartItem" }],
    deliveryTip: { type: Number, default: 0 },

    coupon: { type: Schema.ObjectId, ref: "Coupon" },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
