const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const restaurantPromotionBannerSchema = new mongoose.Schema(
  {
    bannerImage: { type: String },
    bannerName: { type: String },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    verify: { type: Boolean, default: false },
    expire: { type: Date },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
restaurantPromotionBannerSchema.index({ location: "2dsphere" });

const RestaurantPromotionBanner = mongoose.model(
  "RestaurantPromotionBanner",
  restaurantPromotionBannerSchema
);

module.exports = RestaurantPromotionBanner;
