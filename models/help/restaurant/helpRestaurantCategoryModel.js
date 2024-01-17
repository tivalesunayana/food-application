const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpRestaurantCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpRestaurantSubCategory: [
      {
        type: Schema.ObjectId,
        ref: "helpRestaurantSubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpRestaurantCategory = mongoose.model(
  "HelpRestaurantCategory",
  helpRestaurantCategorySchema
);

module.exports = HelpCustomerCategory;
