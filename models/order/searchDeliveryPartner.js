const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const searchDeliveryPartnerSchema = new mongoose.Schema(
  {
    order: { type: Schema.ObjectId, ref: "Order" },

    rejectedDeliveryPartner: [
      {
        type: Schema.ObjectId,
        ref: "DeliveryPartner",
      },
    ],
    availableDeliveryPartner: [
      {
        type: Schema.ObjectId,
        ref: "DeliveryPartner",
      },
    ],
    index: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SearchDeliveryPartner = mongoose.model(
  "SearchDeliveryPartner",
  searchDeliveryPartnerSchema
);

module.exports = SearchDeliveryPartner;
