const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const androidLoginHistorySchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true },
    logOut: { type: Boolean, default: false },
    Customer: { type: Schema.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);

const AndroidLoginHistory = mongoose.model(
  "AndroidLoginHistory",
  androidLoginHistorySchema
);

module.exports = AndroidLoginHistory;
