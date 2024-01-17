const mongoose = require("mongoose");
const deliveryPartnerDeductionSchema = new mongoose.Schema(
  {
    deliveryPartner: {
      type: Schema.ObjectId,
      ref: "DeliveryPartner",
    },
    amountSubmitted: {
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

const DeliveryPartnerDeduction = mongoose.model(
  "DeliveryPartnerEarning",
  deliveryPartnerDeductionSchema
);

module.exports = DeliveryPartnerDeduction;
