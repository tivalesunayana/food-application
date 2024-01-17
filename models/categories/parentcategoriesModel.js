const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const parentCategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rank: {
      type: String,
    },
    image_url: {
      type: String,
    },
    status: {
      type: String,
    },
    id: {
      type: String,
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const ParentCategories = mongoose.model(
  "ParentCategories",
  parentCategoriesSchema
);

module.exports = ParentCategories;
