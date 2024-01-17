const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const customerIOSSchema = new mongoose.Schema(
  {
    currentAppVersion: { type: Number },
    unsupportedAppVersion: { type: Number },
  },
  {
    timestamps: true,
  }
);

const CustomerIOS = mongoose.model("CustomerIOS", customerIOSSchema);

module.exports = CustomerIOS;
