const Order = require("./../../models/order/orderModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { mongoose } = require("mongoose");

exports.reportDataToday = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const subDate = (day) => {
    var date = new Date();
    const dd = new Date(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );

    return dd;
  };

  const data = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "Delivered",
        createdAt: {
          $gte: new Date(subDate()),
        },
      },
    },
    {
      $group: {
        _id: null,
        price: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);
  const order = await Order.find({
    restaurant: restaurantId,
    status: "Delivered",
    createdAt: {
      $gte: new Date(subDate()),
    },
  }).select(["price", "orderId", "createdAt"]);

  res.status(200).json({
    status: "success",
    message: "successful",
    data: data[0] ? data[0] : null,
    order,
  });
});

exports.reportDataWeek = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const subDate = (day) => {
    var date = new Date();
    const dd = new Date(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );

    return dd.getTime() + day * 24 * 60 * 60 * 1000;
  };

  const data = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "Delivered",
        createdAt: {
          $gte: new Date(subDate(-7)),
        },
      },
    },
    {
      $group: {
        _id: null,
        price: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);
  const order = await Order.find({
    restaurant: restaurantId,
    status: "Delivered",
    createdAt: {
      $gte: new Date(subDate(-7)),
    },
  }).select(["price", "orderId", "createdAt"]);

  res.status(200).json({
    status: "success",
    message: "successful",
    data: data[0] ? data[0] : null,
    order,
  });
});

exports.reportDataMonth = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const subDate = (day) => {
    var date = new Date();
    const dd = new Date(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );

    return dd.getTime() + day * 24 * 60 * 60 * 1000;
  };

  const data = await Order.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "Delivered",
        createdAt: {
          $gte: new Date(subDate(-30)),
        },
      },
    },
    {
      $group: {
        _id: null,
        price: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);
  const order = await Order.find({
    restaurant: restaurantId,
    status: "Delivered",
    createdAt: {
      $gte: new Date(subDate(-30)),
    },
  }).select(["price", "orderId", "createdAt"]);

  res.status(200).json({
    status: "success",
    message: "successful",
    data: data[0] ? data[0] : null,
    order,
  });
});
