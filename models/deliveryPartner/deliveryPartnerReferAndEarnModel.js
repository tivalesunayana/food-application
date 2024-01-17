const mongoose = require("mongoose");
const validator = require("validator");
const deliveryPartnerReferAndEarnSchema = new mongoose.Schema(
  {
    amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerReferAndEarn = mongoose.model(
  "DeliveryPartnerReferAndEarn",
  deliveryPartnerReferAndEarnSchema
);

module.exports = DeliveryPartnerReferAndEarn;
