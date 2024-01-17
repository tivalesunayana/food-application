const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const brandSchema = new mongoose.Schema(
  {
    image: { type: String },
    title: { type: String },
    visible: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
