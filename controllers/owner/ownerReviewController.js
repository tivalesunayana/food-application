const catchAsync = require("../../utils/catchAsync");
const { uploadImg, deleteFile } = require("../../config/s3config");
const AppError = require("../../utils/appError");
const RestaurantReview = require("../../models/restaurant/restaurantReviewModel");
const AppReviewByRestaurant = require("../../models/appReview/appReviewByRestaurantModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const DeliveryPartnerReviewRestaurant = require("../../models/deliveryPartner/deliveryPartnerReviewRestaurantModel");
const Order = require("../../models/order/orderModel");
exports.getRestaurantReview = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const one = await RestaurantReview.count({
    restaurant: restaurantId,
    rating: 1,
  });
  const two = await RestaurantReview.count({
    restaurant: restaurantId,
    rating: 2,
  });
  const three = await RestaurantReview.count({
    restaurant: restaurantId,
    rating: 3,
  });
  const four = await RestaurantReview.count({
    restaurant: restaurantId,
    rating: 4,
  });
  const five = await RestaurantReview.count({
    restaurant: restaurantId,
    rating: 5,
  });
  const average = (one + two + three + four + five) / 5;
  const total = await RestaurantReview.count({ restaurant: restaurantId });
  const data = await RestaurantReview.find({
    restaurant: restaurantId,
  }).populate({ path: "customer", select: "name" });
  res
    .status(200)
    .json({ data: { one, two, three, four, five, total, data, average } });
});
exports.createRestaurantAppReview = catchAsync(async (req, res, next) => {
  const { rating, description } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  const appReview = await AppReviewByRestaurant.create({
    restaurant: restaurant._id,
    rating,
    description,
  });
  res.status(200).json({
    status: "success",
    message: "Review created successfully",
    appReview,
  });
});

exports.createDeliveryPartnerByRestaurantReview = catchAsync(
  async (req, res, next) => {
    const { description, rating } = req.body;
    const { orderId } = req.query;

    const order = await Order.findById(orderId);
    const data = await DeliveryPartnerReviewRestaurant.findOne({
      deliveryPartner: order.deliveryPartner,
      restaurant: order.restaurant,
      order: order._id,
    });
    if (data) {
      data.description = description;
      data.rating = rating;
      await data.save();
    } else {
      const data = await DeliveryPartnerReviewRestaurant.create({
        deliveryPartner: order.deliveryPartner,
        restaurant: order.restaurant,
        order: order._id,
        description,
        rating,
      });
      order.deliveryPartnerReviewByRestaurant = data._id;
      await order.save();
    }
    res.status(200).json({ status: "success", message: "successFully" });
  }
);
