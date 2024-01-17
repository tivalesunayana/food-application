const RestaurantReview = require("../../models/restaurant/restaurantReviewModel");
const catchAsync = require("../../utils/catchAsync");
const ItemReview = require("../../models/review/menuItemReviewModel");
const OrderReview = require("../../models/review/orderReviewModel");
const Order = require("../../models/order/orderModel");
const DeliveryPartnerReviewCustomer = require("../../models/deliveryPartner/deliveryPartnerReviewCustomerModel");
const OrderItem = require("../../models/order/orderItem");
const Restaurant = require("../../models/restaurant/restaurantModel");
const Items = require("../../models/item/itemsModel");

exports.createRestaurantReview = catchAsync(async (req, res, next) => {
  const { description, rating } = req.body;
  const { orderId } = req.query;
  const order = await Order.findById(orderId);
  const reviewData = await RestaurantReview.findOne({
    restaurant: order.restaurant,
    customer: req.customer._id,
    order: order._id,
  });
  if (reviewData) {
    reviewData.description = description;
    reviewData.rating = rating;
    await reviewData.save();
  } else {
    const reviewNewData = await RestaurantReview.create({
      restaurant: order.restaurant,
      customer: req.customer._id,
      order: order._id,
      description,
      rating,
    });
    const restaurant = await Restaurant.findById(order.restaurant);
    restaurant.ratingCount = restaurant.ratingCount + 1;
    restaurant.rating =
      (restaurant.rating * restaurant.ratingCount - 1 + rating) /
      restaurant.ratingCount;
    order.customerRestaurantReview = reviewNewData._id;
    await restaurant.save();
    await order.save();
  }
  res.status(200).json({ status: "success", message: "successFully" });
});

exports.getRestaurantReview = catchAsync(async (req, res, next) => {
  const { restaurantId, page, limit } = req.query;
  const skip = page * limit - limit;
  const review = await RestaurantReview.find({ restaurant: restaurantId })
    .limit(limit)
    .skip(skip);

  const total = await RestaurantReview.count({ restaurant: restaurantId });

  res
    .status(200)
    .json({ status: "success", message: "successFully", data: review, total });
});

exports.createMenuItemReview = catchAsync(async (req, res, next) => {
  const { description, rating } = req.body;
  const { orderItemId } = req.query;

  const orderItem = await OrderItem.findById(orderItemId);
  // const order = await Order.findById(orderItem.order)

  const reviewData = await ItemReview.findOne({
    item: orderItem.item,
    customer: req.customer._id,
    orderItem: orderItem._id,
  });
  if (reviewData) {
    reviewData.description = description;
    reviewData.rating = rating;
    await reviewData.save();
  } else {
    const reviewNewData = await ItemReview.create({
      item: orderItem.item,
      customer: req.customer._id,
      orderItem: orderItem._id,
      description,
      rating,
    });
    const item = await Items.findById(orderItem.item);
    item.ratingCount = item.ratingCount + 1;
    item.rating =
      (item.rating ? item.rating : 0 * item.ratingCount - 1 + rating) /
      item.ratingCount;
    orderItem.itemReview = reviewNewData._id;
    await orderItem.save();
    await item.save();
  }

  res.status(200).json({ status: "success", message: "successFully" });
});

exports.getMenuItemReview = catchAsync(async (req, res, next) => {
  const { menuItemId, page, limit } = req.query;
  const skip = page * limit - limit;
  const review = await ItemReview.find({ menuItem: menuItemId })
    .limit(limit)
    .skip(skip);

  const total = await ItemReview.count({ menuItem: menuItemId });

  res
    .status(200)
    .json({ status: "success", message: "successFully", data: review, total });
});

exports.createOrderReview = catchAsync(async (req, res, next) => {
  const { description, rating } = req.body;
  const { orderId } = req.query;
  const order = await Order.findById(orderId);
  const reviewData = await OrderReview.findOne({
    order: orderId,
    customer: req.customer._id,
  });
  if (reviewData) {
    reviewData.description = description;
    reviewData.rating = rating;
    await reviewData.save();
  } else {
    const reviewNewData = await OrderReview.create({
      order: orderId,
      customer: req.customer._id,
      description,
      rating,
    });
    order.orderReview = reviewNewData._id;
    await order.save();
  }
  res.status(200).json({ status: "success", message: "successFully" });
});

exports.getOrderReview = catchAsync(async (req, res, next) => {
  const { orderId, page, limit } = req.query;
  const skip = page * limit - limit;
  const review = await OrderReview.find({ order: orderId })
    .limit(limit)
    .skip(skip);

  const total = await OrderReview.count({ order: orderId });

  res
    .status(200)
    .json({ status: "success", message: "successFully", data: review, total });
});

exports.createDeliveryPartnerReview = catchAsync(async (req, res, next) => {
  const { description, rating } = req.body;
  const { orderId } = req.query;
  const order = await Order.findById(orderId);

  const data = await DeliveryPartnerReviewCustomer.findOne({
    deliveryPartner: order.deliveryPartner,
    customer: req.customer._id,
    order: order._id,
  });
  if (data) {
    data.description = description;
    data.rating = rating;
    await data.save();
  } else {
    const reviewNewData = await DeliveryPartnerReviewCustomer.create({
      deliveryPartner: order.deliveryPartner,
      customer: req.customer._id,
      order: order._id,
      description,
      rating,
    });
    order.deliveryPartnerReviewByCustomer = reviewNewData._id;
    await order.save();
  }
  res.status(200).json({ status: "success", message: "successFully" });
});

exports.getDeliveryPartnerReview = catchAsync(async (req, res, next) => {
  const { deliveryPartnerId, page, limit } = req.query;
  const skip = page * limit - limit;
  const review = await DeliveryPartnerReviewCustomer.find({
    deliveryPartner: deliveryPartnerId,
  })
    .limit(limit)
    .skip(skip);

  const total = await DeliveryPartnerReviewCustomer.count({
    deliveryPartner: deliveryPartnerId,
  });

  res
    .status(200)
    .json({ status: "success", message: "successFully", data: review, total });
});
