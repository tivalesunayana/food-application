const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantReviewDeliveryPartnerSchema = new mongoose.Schema(
  {
    rating: { type: Number, enum: [1, 2, 3, 4, 5] },
    description: { type: String },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    order: { type: Schema.ObjectId, ref: "Order" },
  },
  {
    timestamps: true,
  }
);

const RestaurantReviewDeliveryPartner = mongoose.model(
  "RestaurantReviewDeliveryPartner",
  restaurantReviewDeliveryPartnerSchema
);

module.exports = RestaurantReviewDeliveryPartner;
