const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const addongroupsSchema = new mongoose.Schema(
  {
    addongroupid: {
      type: String,
    },
    addongroup_rank: {
      type: String,
      default: "1",
    },
    active: {
      type: String,
      default: "1",
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    addongroupitems: [
      {
        addonitemid: {
          type: String,
        },
        addonitem_name: {
          type: String,
        },
        restaurant: {
          type: Schema.ObjectId,
          ref: "Restaurant",
        },
        addonitem_price: {
          type: String,
          default: "0",
        },
        active: {
          type: String,
          default: "1",
        },
        attributes: {
          type: String,
        },
        addonitem_rank: {
          type: String,
          default: "1",
        },
      },
    ],
    addongroup_name: { type: String },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Addongroups = mongoose.model("Addongroups", addongroupsSchema);

module.exports = Addongroups;
