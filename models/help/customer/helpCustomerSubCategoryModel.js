const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpCustomerSubCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpCustomerTopic: [
      {
        type: Schema.ObjectId,
        ref: "helpCustomerTopic",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpCustomerSubCategory = mongoose.model(
  "HelpCustomerSubCategory",
  helpCustomerSubCategorySchema
);

module.exports = HelpCustomerSubCategory;
