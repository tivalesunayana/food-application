const Restaurant = require("../../models/restaurant/restaurantModel");
const RestaurantPromotionBanner = require("../../models/restaurant/restaurantPromotionBannerModel");
const RestaurantPromotionBannerPayment = require("../../models/restaurant/restaurantPromotionBannerPaymentModel");
const RestaurantPromotionBannerPlan = require("../../models/restaurant/restaurantPromotionBannerPlanModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
exports.getAllUnapprovedPromotionBanner = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = page * limit - limit;
  const restaurantPromotionBanner = await RestaurantPromotionBanner.find({
    paymentStatus: "completed",
  })
    .limit(limit || 10)
    .skip(skip);
  res.status(200).json({
    restaurantPromotionBanner,
    status: "success",
    message: "successfully",
  });
});

exports.approvePromotionBanner = catchAsync(async (req, res, next) => {
  const { restaurantPromotionBannerId } = req.query;

  const restaurantPromotionBanner = await RestaurantPromotionBanner.findById(
    restaurantPromotionBannerId
  );
  if (!restaurantPromotionBanner.bannerImage) {
    return next(new AppError("Image is not uploaded ", 404));
  }
  if (restaurantPromotionBanner.paymentStatus === "completed") {
    return next(new AppError("payment is pending or failed", 404));
  }
  restaurantPromotionBanner.verify = true;
  await restaurantPromotionBanner.save();
  res.status(200).json({
    restaurantPromotionBanner,
    status: "success",
    message: "restaurant promotion banner approve successfully",
  });
});
