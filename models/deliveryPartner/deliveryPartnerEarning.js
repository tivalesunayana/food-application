const mongoose = require("mongoose");
const deliveryPartnerEarningSchema = new mongoose.Schema(
  {
    deliveryPartner: {
      type: Schema.ObjectId,
      ref: "DeliveryPartner",
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerEarning = mongoose.model(
  "DeliveryPartnerEarning",
  deliveryPartnerEarningSchema
);

module.exports = DeliveryPartnerEarning;
