const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const favouriteMenuItemSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    items: [{ type: Schema.ObjectId, ref: "Items" }],
  },
  {
    timestamps: true,
  }
);

const FavouriteMenuItem = mongoose.model(
  "FavouriteMenuItem",
  favouriteMenuItemSchema
);
module.exports = FavouriteMenuItem;
