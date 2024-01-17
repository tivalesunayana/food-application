const mongoose = require("mongoose");
const deliveryPartnerCashLogSchema = new mongoose.Schema(
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

const DeliveryPartnerCashLog = mongoose.model(
  "DeliveryPartnerCashLog",
  deliveryPartnerCashLogSchema
);

module.exports = DeliveryPartnerCashLog;
