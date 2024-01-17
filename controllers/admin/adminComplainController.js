const OrderComplain = require("./../../models/order/orderComplainModel");
const appError = require("./../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
// const Razorpay = require("razorpay");
const Order = require("../../models/order/orderModel");
const AppReviewByRestaurant = require("../../models/appReview/appReviewByRestaurantModel");
const Payment = require("../../models/payment/paymentModel");

// View app reviews
exports.viewAppReview = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const appReview = await AppReviewByRestaurant.find()
    .populate("restaurant")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await AppReviewByRestaurant.count();
  res.status(200).json({
    data: appReview,
    total,
    status: "success",
    message: "successfully",
  });
});

// Get order complains
exports.getComplain = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const orderComplain = await OrderComplain.find()
    .populate("order")
    .populate("restaurant")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await OrderComplain.count();
  res.status(200).json({
    data: orderComplain,
    total,
    status: "success",
    message: "successfully",
  });
});

// Refund order complain
exports.refundOrderComplain = catchAsync(async (req, res, next) => {
  res.status(200).json({
    // data: orderComplain,
    status: "success",
    message: "Need to talk to bank for refund ",
  });
});
