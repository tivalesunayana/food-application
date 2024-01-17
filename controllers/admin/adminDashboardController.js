const Customer = require("../../models/customer/customerModel");
const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const Order = require("../../models/order/orderModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");

// Function to subtract days from the current date
const subDate = (day) => {
  var date = new Date();
  const dd = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );
  return dd.getTime() + day * 24 * 60 * 60 * 1000;
};

// Get dashboard data
exports.getDashBoard = catchAsync(async (req, res, next) => {
  // Customer statistics
  const totalCustomer = await Customer.count();
  const todayCustomer = await Customer.count({
    createdAt: { $gte: new Date(subDate(0)) },
  });
  const weekCustomer = await Customer.count({
    createdAt: { $gte: new Date(subDate(-7)) },
  });
  const monthCustomer = await Customer.count({
    createdAt: { $gte: new Date(subDate(-30)) },
  });
  const yearCustomer = await Customer.count({
    createdAt: { $gte: new Date(subDate(-365)) },
  });

  // Restaurant statistics
  const totalRestaurant = await Restaurant.count({ approved: true });
  const todayRestaurant = await Restaurant.count({
    createdAt: { $gte: new Date(subDate(0)) },
    approved: true,
  });
  const weekRestaurant = await Restaurant.count({
    createdAt: { $gte: new Date(subDate(-7)) },
    approved: true,
  });
  const monthRestaurant = await Restaurant.count({
    createdAt: { $gte: new Date(subDate(-30)) },
    approved: true,
  });
  const yearRestaurant = await Restaurant.count({
    createdAt: { $gte: new Date(subDate(-365)) },
    approved: true,
  });

  // Delivery Partner statistics
  const totalDeliveryPartner = await DeliveryPartner.count({
    status: "active",
  });
  const todayDeliveryPartner = await DeliveryPartner.count({
    createdAt: { $gte: new Date(subDate(0)) },
    status: "active",
  });
  const weekDeliveryPartner = await DeliveryPartner.count({
    createdAt: { $gte: new Date(subDate(-7)) },
    status: "active",
  });
  const monthDeliveryPartner = await DeliveryPartner.count({
    createdAt: { $gte: new Date(subDate(-30)) },
    status: "active",
  });
  const yearDeliveryPartner = await DeliveryPartner.count({
    createdAt: { $gte: new Date(subDate(-365)) },
    status: "active",
  });

  // Order statistics
  const totalOrder = await Order.count({
    status: "Delivered",
  });
  const todayOrder = await Order.count({
    createdAt: { $gte: new Date(subDate(0)) },
    status: "Delivered",
  });
  const weekOrder = await Order.count({
    createdAt: { $gte: new Date(subDate(-7)) },
    status: "Delivered",
  });
  const monthOrder = await Order.count({
    createdAt: { $gte: new Date(subDate(-30)) },
    status: "Delivered",
  });
  const yearOrder = await Order.count({
    createdAt: { $gte: new Date(subDate(-365)) },
    status: "Delivered",
  });

  // Aggregate all data and send response
  const data = {
    totalCustomer,
    todayCustomer,
    weekCustomer,
    monthCustomer,
    yearCustomer,
    totalRestaurant,
    todayRestaurant,
    weekRestaurant,
    monthRestaurant,
    yearRestaurant,
    totalDeliveryPartner,
    todayDeliveryPartner,
    weekDeliveryPartner,
    monthDeliveryPartner,
    yearDeliveryPartner,
    totalOrder,
    todayOrder,
    weekOrder,
    monthOrder,
    yearOrder,
  };
  res.status(200).json({ status: "success", message: "successful", data });
});
