const mongoose = require("mongoose");
const validator = require("validator");
const customerNotificationSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    show: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const CustomerNotification = mongoose.model(
  "CustomerNotification",
  customerNotificationSchema
);

module.exports = CustomerNotification;
