const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const taxesSchema = new mongoose.Schema(
  {
    taxid: {
      type: String,
    },
    taxname: {
      type: String,
    },
    tax: {
      type: String,
    },
    taxtype: {
      type: String,
      default: 1,
    },
    tax_ordertype: {
      type: String,
    },

    active: {
      type: String,
    },
    tax_coreortotal: {
      type: String,
    },
    tax_taxtype: {
      type: String,
    },
    rank: {
      type: String,
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    consider_in_core_amount: {
      type: String,
    },
    description: {
      type: String,
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
const Taxes = mongoose.model("Taxes", taxesSchema);

module.exports = Taxes;
