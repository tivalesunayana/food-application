const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerCurrentLocationSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], //  [<longitude>, <latitude> ]
        required: [true, "please enter your coordinates!"],
      },
    },
    locationUpdatedAt: { type: Date },
    updateCount: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    online: { type: Boolean, default: false },
    cashAmount: { type: Number, default: 0 },
    deliveryPartnerCashLog: [
      {
        type: Schema.ObjectId,
        ref: "DeliveryPartnerCashLog",
      },
    ],
    cashLimit: { type: Number, default: 2000 },
    currentOrder: { type: Schema.ObjectId, ref: "Order" },
    socketId: { type: String },
    deliveryPartner: {
      type: Schema.ObjectId,
      ref: "DeliveryPartner",
    },
  },
  {
    timestamps: true,
  }
);

deliveryPartnerCurrentLocationSchema.index({ location: "2dsphere" });

const DeliveryPartnerCurrentLocation = mongoose.model(
  "DeliveryPartnerCurrentLocation",
  deliveryPartnerCurrentLocationSchema
);

module.exports = DeliveryPartnerCurrentLocation;
