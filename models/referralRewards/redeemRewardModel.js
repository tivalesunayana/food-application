const mongoose = require("mongoose");
Schema = mongoose.Schema;

const redeemSchema = new mongoose.Schema({
  points: { type: Number, default: 0, required: true },
  image: { type: String },
  name: { type: String, required: true },
  rewardCount: { type: Number, default: 0 },
  description: { type: String },
});

const Redeem = mongoose.model("Redeem", redeemSchema);
module.exports = Redeem;
