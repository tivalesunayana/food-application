const mongoose = require("mongoose");
const validator = require("validator");
const deliveryPartnerNotificationSchema = new mongoose.Schema(
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

const DeliveryPartnerNotification = mongoose.model(
  "DeliveryPartnerNotification",
  deliveryPartnerNotificationSchema
);

module.exports = DeliveryPartnerNotification;
