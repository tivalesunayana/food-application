const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const CustomerDeliveryPartnerReview = require("../../models/customer/customerDeliveryPartnerReviewModel");
const RestaurantReviewDeliveryPartner = require("../../models/restaurant/restaurantReviewByDeliveryPartnerModel");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const DeliveryPartnerReviewRestaurant = require("../../models/deliveryPartner/deliveryPartnerReviewRestaurantModel");
const DeliveryPartnerReviewCustomer = require("../../models/deliveryPartner/deliveryPartnerReviewCustomerModel");
const Order = require("../../models/order/orderModel");
const { response } = require("express");

exports.createCustomerByDeliveryPartnerReview = catchAsync(
  async (req, res, next) => {
    const { description, rating } = req.body;
    const { orderId } = req.query;
    const order = await Order.findById(orderId);
    const data = await CustomerDeliveryPartnerReview.findOne({
      deliveryPartner: req.deliveryPartner._id,
      customer: order.customer,
      order: order._id,
    });
    if (data) {
      data.description = description;
      data.rating = rating;
      await data.save();
    } else {
      const data = await CustomerDeliveryPartnerReview.create({
        deliveryPartner: req.deliveryPartner._id,
        customer: order.customer,
        order: order._id,
        description,
        rating,
      });
      order.customerReviewByDeliveryPartner = data._id;
      await order.save();
    }
    res.status(200).json({ status: "success", message: "successFully" });
  }
);

exports.createRestaurantByDeliveryPartnerReview = catchAsync(
  async (req, res, next) => {
    const { description, rating } = req.body;
    const { orderId } = req.query;
    const order = await Order.findById(orderId);
    const data = await RestaurantReviewDeliveryPartner.findOne({
      deliveryPartner: req.deliveryPartner._id,
      restaurant: order.restaurant,
      order: order._id,
    });
    if (data) {
      data.description = description;
      data.rating = rating;
      await data.save();
    } else {
      const data = await RestaurantReviewDeliveryPartner.create({
        deliveryPartner: req.deliveryPartner._id,
        restaurant: order.restaurant,
        order: order._id,
        description,
        rating,
      });
      order.restaurantReviewByDeliveryPartner = data._id;
      await order.save();
    }
    res.status(200).json({ status: "success", message: "successFully" });
  }
);
exports.performance = catchAsync(async (req, res, next) => {
  const restaurantReview = await DeliveryPartnerReviewRestaurant.aggregate([
    {
      $match: {
        deliveryPartner: req.deliveryPartner._id,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const customerReview = await DeliveryPartnerReviewCustomer.aggregate([
    {
      $match: {
        deliveryPartner: req.deliveryPartner._id,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const orderCount = await Order.count({
    deliveryPartner: req.deliveryPartner._id,
  });
  res.status(200).json({
    status: "success",
    message: "Success",
    data: {
      orderCount,
      customerReview,
      restaurantReview,
    },
  });
});
