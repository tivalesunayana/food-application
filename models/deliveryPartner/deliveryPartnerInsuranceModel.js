const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const DeliveryPartnerInsuranceSchema = new mongoose.Schema(
  {
    insuranceFile: {
      type: String,
    },
    insuranceNumber: {
      type: String,
    },

    expireDate: {
      type: "Date",
    },
    issueDate: {
      type: "Date",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerInsurance = mongoose.model(
  "DeliveryPartnerInsurance",
  DeliveryPartnerInsuranceSchema
);

module.exports = DeliveryPartnerInsurance;
