const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const ordertypesSchema = new mongoose.Schema(
  {
    ordertypeid: {
      type: Number,
    },
    ordertype: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
  },
  {
    timestamps: true,
  }
);
const Ordertypes = mongoose.model("Ordertypes", ordertypesSchema);

module.exports = Ordertypes;
