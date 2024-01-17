const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const deliveryPartnerLoginLogSchema = new mongoose.Schema(
  {
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    image: { type: String },
    loginDate: { type: Date },
    loginData: [{ type: Schema.ObjectId, ref: "DeliveryPartnerLoginLogTime" }],
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerLoginLog = mongoose.model(
  "DeliveryPartnerLoginLog",
  deliveryPartnerLoginLogSchema
);

module.exports = DeliveryPartnerLoginLog;
