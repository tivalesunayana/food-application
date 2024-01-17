const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const customerDeliveryPartnerReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    review: { type: String },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    customer: { type: Schema.ObjectId, ref: "Customer" },
    order: { type: Schema.ObjectId, ref: "Order" },
  },
  {
    timestamps: true,
  }
);

const CustomerDeliveryPartnerReview = mongoose.model(
  "CustomerDeliveryPartnerReview",
  customerDeliveryPartnerReviewSchema
);

module.exports = CustomerDeliveryPartnerReview;
