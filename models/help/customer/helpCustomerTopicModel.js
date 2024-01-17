const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpCustomerTopicSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const HelpCustomerTopic = mongoose.model(
  "HelpCustomerTopic",
  helpCustomerTopicSchema
);

module.exports = HelpCustomerTopic;
