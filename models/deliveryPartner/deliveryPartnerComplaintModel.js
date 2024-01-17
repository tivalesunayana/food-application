const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const DeliveryPartnerComplaintSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    order: { type: Schema.ObjectId, ref: "Order" },
    complaint: { type: String },
    image: [{ type: String }],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "complete"],
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerComplaint = mongoose.model(
  "DeliveryPartnerComplaint",
  DeliveryPartnerComplaintSchema
);

module.exports = DeliveryPartnerComplaint;
