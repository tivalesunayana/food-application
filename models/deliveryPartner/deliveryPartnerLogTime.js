const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const deliveryPartnerLoginLogTimeSchema = new mongoose.Schema(
  {
    startTime: { type: Date },
    endTime: { type: Date },

    deliveryPartnerLoginLog: {
      type: Schema.ObjectId,
      ref: "DeliveryPartnerLoginLog",
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerLoginLogTime = mongoose.model(
  "DeliveryPartnerLoginLogTime",
  deliveryPartnerLoginLogTimeSchema
);

module.exports = DeliveryPartnerLoginLogTime;
