const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpCustomerCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpCustomerSubCategory: [
      {
        type: Schema.ObjectId,
        ref: "helpCustomerSubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpCustomerCategory = mongoose.model(
  "HelpCustomerCategory",
  helpCustomerCategorySchema
);

module.exports = HelpCustomerCategory;
