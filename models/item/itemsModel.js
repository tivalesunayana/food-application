const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const itemsSchema = new mongoose.Schema(
  {
    itemid: {
      type: String,
    },
    itemallowvariation: {
      type: String,
    },
    itemrank: {
      type: String,
      default: "1",
    },
    item_categoryid: {
      type: String,
    },
    item_ordertype: {
      type: String,
    },

    item_packingcharges: {
      type: String,
    },
    ybitesPackingCharges: {
      type: Number,
      default: 15,
    },
    itemallowaddon: {
      type: String,
    },
    itemaddonbasedon: {
      type: String,
    },
    item_favorite: {
      type: String,
    },
    ignore_taxes: {
      type: String,
      default: "0",
    },
    ignore_discounts: {
      type: String,
      default: "0",
    },
    in_stock: {
      type: String,
      default: "1",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    cuisine: [{ type: String }],
    variation_groupname: {
      type: String,
    },

    variation: [
      {
        id: {
          type: String,
        },
        variationid: {
          type: String,
        },
        name: {
          type: String,
        },
        groupname: {
          type: String,
        },
        price: {
          type: String,
        },
        active: {
          type: String,
        },
        variationallowaddon: {
          type: Number,
        },
        item_packingcharges: {
          type: String,
        },
        variationrank: {
          type: String,
          default: "0",
        },
        addon: [
          {
            addon_group_id: {
              type: String,
            },
            addon_item_selection_min: {
              type: String,
            },
            addon_item_selection_max: {
              type: String,
            },
          },
        ],
      },
    ],
    addon: [
      {
        addon_group_id: {
          type: String,
        },
        addon_item_selection_min: {
          type: String,
        },
        addon_item_selection_max: {
          type: String,
        },
      },
    ],
    item_attributeid: {
      type: String,
    },
    itemname: {
      type: String,
    },
    itemdescription: {
      type: String,
    },
    minimumpreparationtime: {
      type: String,
    },
    price: {
      type: String,
    },
    bhiwandiItemPrice: {
      type: Number,
      default: 0,
    },
    active: {
      type: String,
      default: "1",
    },
    item_image_url: {
      type: String,
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: "Restaurant",
    },
    item_tax: {
      type: String,
    },
    rating: { type: Number },
    ratingCount: { type: Number, default: 0 },
    gst_type: {
      type: String,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
    itemVisible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

itemsSchema.pre(/^find/, function (next) {
  this.find({ deleted: { $ne: true } });

  next();
});
itemsSchema.pre(/^count/, function (next) {
  this.find({ deleted: { $ne: true } });

  next();
});
itemsSchema.index({ location: "2dsphere" });

const Items = mongoose.model("Items", itemsSchema);

module.exports = Items;
