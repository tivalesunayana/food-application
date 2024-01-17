const mongoose = require("mongoose");
const adminPromotionBannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
    },
    bannerName: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminPromotionBanner = mongoose.model(
  "AdminPromotionBanner",
  adminPromotionBannerSchema
);

module.exports = AdminPromotionBanner;
