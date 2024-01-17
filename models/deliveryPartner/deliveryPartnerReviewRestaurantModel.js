const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerReviewRestaurantSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    order: { type: Schema.ObjectId, ref: "Order" },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerReviewRestaurant = mongoose.model(
  "DeliveryPartnerReviewRestaurant",
  deliveryPartnerReviewRestaurantSchema
);

module.exports = DeliveryPartnerReviewRestaurant;
