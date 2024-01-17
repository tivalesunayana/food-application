const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralAppSchema = new Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    referralCode: {
      type: String,
    },

    referredUsers: [{ type: Schema.ObjectId, ref: "Customer" }],

    points: {
      type: Number,
      default: 0,
    },
    isUsedReferralCode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const referrals = mongoose.model("referrals", referralAppSchema);

module.exports = referrals;
