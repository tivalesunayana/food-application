const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const customerAndroidSchema = new mongoose.Schema(
  {
    currentAppVersion: { type: Number },
    unsupportedAppVersion: { type: Number },
  },
  {
    timestamps: true,
  }
);

const CustomerAndroid = mongoose.model(
  "CustomerAndroid",
  customerAndroidSchema
);

module.exports = CustomerAndroid;
