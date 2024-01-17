const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerSelfieSchema = new mongoose.Schema(
  {
    image: { type: String },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    date: { type: Date, default: new Date() },
    accepted: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerSelfie = mongoose.model(
  "DeliveryPartnerSelfie",
  deliveryPartnerSelfieSchema
);

module.exports = DeliveryPartnerSelfie;
