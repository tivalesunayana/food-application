const Restaurant = require("../../models/restaurant/restaurantModel");
const RestaurantPromotionBanner = require("../../models/restaurant/restaurantPromotionBannerModel");
const RestaurantPromotionBannerPayment = require("../../models/restaurant/restaurantPromotionBannerPaymentModel");
const RestaurantPromotionBannerPlan = require("../../models/restaurant/restaurantPromotionBannerPlanModel");
const catchAsync = require("../../utils/catchAsync");
const { uploadImg, deleteFile } = require("../../config/s3config");
const AppError = require("../../utils/appError");

exports.createPromotionBanner = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { bannerName } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  if (restaurant.restaurantPromotionBanner) {
    return next(
      new AppError("Promotion banner already exist, please update it ", 409)
    );
  }
  const restaurantPromotionBanner = await RestaurantPromotionBanner.create({
    bannerName,
    location: restaurant.location,
    restaurant: restaurant._id,
  });
  restaurant.restaurantPromotionBanner = restaurantPromotionBanner._id;
  await restaurant.save();
  res.status(200).json({
    restaurantPromotionBanner,
    status: "success",
    message: "restaurant promotion banner created successfully",
  });
});

exports.uploadPromotionBanner = catchAsync(async (req, res, next) => {
  const { restaurantPromotionBannerId } = req.query;
  const file = req.file;
  const response = await uploadImg(file);

  const restaurantPromotionBanner = await RestaurantPromotionBanner.findById(
    restaurantPromotionBannerId
  );
  if (restaurantPromotionBanner.bannerImage) {
    await deleteFile(restaurantPromotionBanner.bannerImage);
  }
  restaurantPromotionBanner.bannerImage = response.Key;
  restaurantPromotionBanner.verify = false;
  await restaurantPromotionBanner.save();
  res.status(200).json({
    restaurantPromotionBanner,
    status: "success",
    message: "restaurant promotion banner upload successfully",
  });
});
