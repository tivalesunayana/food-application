const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const favouriteOrderSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    order: { type: Schema.ObjectId, ref: "Order" },
  },

  {
    timestamps: true,
  }
);

const FavouriteOrder = mongoose.model("FavouriteOrder", favouriteOrderSchema);
module.exports = FavouriteOrder;
