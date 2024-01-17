const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerSelfiesOftheDaySchema = new mongoose.Schema(
  {
    image: [{ type: String }],
    // image1: { type: String },
    // image2: { type: String },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    date: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerSelfiesOftheDay = mongoose.model(
  "DeliveryPartnerSelfiesOftheDay",
  deliveryPartnerSelfiesOftheDaySchema
);

module.exports = DeliveryPartnerSelfiesOftheDay;
