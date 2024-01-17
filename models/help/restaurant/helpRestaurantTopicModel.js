const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const helpRestaurantTopicSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const HelpRestaurantTopic = mongoose.model(
  "HelpRestaurantTopic",
  helpRestaurantTopicSchema
);

module.exports = HelpRestaurantTopic;
