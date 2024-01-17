const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const cartItemSchema = new mongoose.Schema(
  {
    item: { type: Schema.ObjectId, ref: "Items" },
    quantity: { type: Number },
    cart: { type: Schema.ObjectId, ref: "Cart" },
    variation: { type: String },

    addons: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
