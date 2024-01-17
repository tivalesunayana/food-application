const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const appCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    visible: { type: Boolean, default: false },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const AppCategory = mongoose.model("AppCategory", appCategorySchema);

module.exports = AppCategory;
