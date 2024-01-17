const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const categoriesSchema = new mongoose.Schema(
  {
    categoryid: {
      type: String,
    },
    active: {
      type: String,
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    categoryrank: {
      type: String,
    },
    parent_category_id: {
      type: String,
    },
    categoryname: {
      type: String,
    },
    categorytimings: {
      type: String,
    },

    category_image_url: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
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
const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
