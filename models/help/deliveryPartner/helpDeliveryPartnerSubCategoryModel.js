const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpDeliveryPartnerSubCategorySchema = new mongoose.Schema(
  {
    title: { type: String },
    helpDeliveryPartnerTopic: [
      {
        type: Schema.ObjectId,
        ref: "helpDeliveryPartnerTopic",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HelpDeliveryPartnerSubCategory = mongoose.model(
  "HelpDeliveryPartnerSubCategory",
  helpDeliveryPartnerSubCategorySchema
);

module.exports = HelpDeliveryPartnerSubCategory;
