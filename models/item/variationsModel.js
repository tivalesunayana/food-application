const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const variationsSchema = new mongoose.Schema(
  {
    variationid: {
      type: String,
    },
    name: {
      type: String,
    },
    groupname: {
      type: String,
    },
    status: {
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
const Variations = mongoose.model("Variations", variationsSchema);

module.exports = Variations;
