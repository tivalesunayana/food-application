const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const bhiwandiItemPriceSchema = new mongoose.Schema(
  {
    
    order: { type: Schema.ObjectId, ref: "Order" },

    orderItems: [{ type: Schema.ObjectId, ref: "OrderItem" }],

 
  },
  {
    timestamps: true,
  }
);



const BhiwandiItemPriceCal = mongoose.model("BhiwandiItemPriceCal", bhiwandiItemPriceSchema);

module.exports = BhiwandiItemPriceCal;
