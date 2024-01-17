const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const itemOffDataSchema = new mongoose.Schema(
  {
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    item: {
      type: Schema.ObjectId,
      ref: "Items",
    },
    openTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const ItemOffData = mongoose.model("ItemOffData", itemOffDataSchema);

module.exports = ItemOffData;
