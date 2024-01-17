const mongoose = require("mongoose");
Schema = mongoose.Schema;

const rewardHistorySchema = new mongoose.Schema(
  {
    redeemedReward: { type: Schema.ObjectId, ref: "Redeem" },
    rewardedCustomer: { type: Schema.ObjectId, ref: "referrals" },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Delivered"],
      default: "Pending",
    },

    customer: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
  },
  {
    timestamps: true,
  }
);

const RewardHistory = mongoose.model("RewardHistory", rewardHistorySchema);
module.exports = RewardHistory;
