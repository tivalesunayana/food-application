const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const attributesSchema = new mongoose.Schema(
  {
    attributeid: {
      type: String,
    },
    attribute: {
      type: String,
    },
    active: {
      type: String,
      default: "1",
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
const Attributes = mongoose.model("Attributes", attributesSchema);

module.exports = Attributes;
