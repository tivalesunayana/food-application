const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const bankDetailSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
    },
    accountNumber: {
      type: Number,
    },
    ifscCode: {
      type: String,
    },
    accountHolderName: { type: String },
    branch: {
      type: String,
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

const BankDetail = mongoose.model("BankDetail", bankDetailSchema);

module.exports = BankDetail;
