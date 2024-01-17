const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");

const deliveryPartnerOrderDataSchema = new mongoose.Schema(
  {
    alarm: { type: Boolean, default: true },
    accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    alarmTimeEndAt: { type: Date },
    // alarmSecond: { type: Number },
    orderData: { type: Schema.ObjectId, ref: "Order" },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    send: { type: Boolean, default: false },
    distance: { type: Number },
    duration: { type: Number },

    restaurant: {
      lat: { type: Number },
      lng: { type: Number },
    },
    customer: {
      lat: { type: Number },
      lng: { type: Number },
    },
    searchId: { type: Schema.ObjectId, ref: "SearchDeliveryPartner" },
    route: { type: String, default: "/NewOrder" },
    earning: { type: Number },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerOrderData = mongoose.model(
  "DeliveryPartnerOrderData",
  deliveryPartnerOrderDataSchema
);

module.exports = DeliveryPartnerOrderData;
