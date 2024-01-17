const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const versionSchema = new mongoose.Schema(
  {
    customerAndroidVersion: { type: String },
    customerIosVersion: { type: String },
    rpAndroidVersion: { type: String },
    rpIosVersion: { type: String },
    dpAndroidVersion: { type: String },
    dpIosVersion: { type: String },
    distance: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

const Version = mongoose.model("Version", versionSchema);

module.exports = Version;
