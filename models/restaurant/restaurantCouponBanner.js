const mongoose = require("mongoose");
const restaurantCouponBannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
    },
    bannerName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantCouponBanner = mongoose.model(
  "RestaurantCoupon",
  restaurantCouponBannerSchema
);

module.exports = RestaurantCouponBanner;
