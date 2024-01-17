const mongoose = require("mongoose");
Schema = mongoose.Schema;

const customerWinCoinsSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    totalCoinValue: { type: Number, required: true },
    isRedeem: { type: Boolean, default: false, required: false },
  },
  {
    timestamps: true,
  }
);

const CustomerWinCoins = mongoose.model(
  "CustomerWinCoins",
  customerWinCoinsSchema
);
module.exports = CustomerWinCoins;
