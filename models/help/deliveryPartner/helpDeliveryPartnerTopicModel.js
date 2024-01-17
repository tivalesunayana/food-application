const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpDeliveryPartnerTopicSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const HelpDeliveryPartnerTopic = mongoose.model(
  "HelpDeliveryPartnerTopic",
  helpDeliveryPartnerTopicSchema
);

module.exports = HelpDeliveryPartnerTopic;
