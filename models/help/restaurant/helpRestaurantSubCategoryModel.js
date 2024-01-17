const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpRestaurantSubCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpRestaurantTopic: [
      {
        type: Schema.ObjectId,
        ref: "helpRestaurantTopic",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpRestaurantSubCategory = mongoose.model(
  "HelpRestaurantSubCategory",
  helpRestaurantSubCategorySchema
);

module.exports = HelpRestaurantSubCategory;
