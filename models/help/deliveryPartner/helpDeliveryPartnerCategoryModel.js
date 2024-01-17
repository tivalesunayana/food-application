const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpDeliveryPartnerCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpDeliveryPartnerSubCategory: [
      {
        type: Schema.ObjectId,
        ref: "helpDeliveryPartnerSubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpDeliveryPartnerCategory = mongoose.model(
  "HelpDeliveryPartnerCategory",
  helpDeliveryPartnerCategorySchema
);

module.exports = HelpDeliveryPartnerCategory;
