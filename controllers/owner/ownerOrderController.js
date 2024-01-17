const { sendNotification } = require("../../config/firebase");
const Restaurant = require("../../models/restaurant/restaurantModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Order = require("./../../models/order/orderModel");
const SearchDeliveryPartner = require("../../models/order/searchDeliveryPartner");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
// const OrderComplain = require("../../models/order/orderComplainModel");
const OrderItem = require("../../models/order/orderItem");
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const Items = require("../../models/item/itemsModel");
const Customer = require("../../models/customer/customerModel");
const Address = require("../../models/address/addressModel");
const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const Payment = require("../../models/payment/paymentModel");
const RestaurantStatusModel = require("../../models/restaurant/restaurantStatusModel");
const OrderComplain = require("../../models/order/orderComplainModel");
const Coupon = require("../../models/offer/couponModal");
const RestaurantCouponBanner = require("../../models/restaurant/restaurantCouponBanner");
const OwnerReport = require("../../models/restaurant/ownerReport");
const fs = require("fs");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} = require("date-fns");
const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 AM)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
};
// exports.getAllOrder = catchAsync(async (req, res, next) => {
//   const { page, limit, restaurantId, status } = req.query;
//   console.log(req.query);
//   const skip = page * limit - limit;
//   const restaurant = await Restaurant.findById(restaurantId);
//   if (!restaurant) {
//     return next(new AppError("No restaurant found", 404));
//   }

//   restaurant.lastSeen = new Date();
//   await restaurant.save();
//   const order = await Order.find({
//     restaurant: restaurantId,
//     paymentStatus: ["Paid", "COD"],
//     status: status,
//     createdAt: { $lte: new Date(Date.now() - 1000 * 121) },
//   })
//     .populate({ path: "orderItems", populate: "item " })
//     .populate({ path: "customer", select: "name , phone" })
//     .populate({ path: "customerAddress" })
//     .populate({ path: "deliveryPartner" })
//     .populate({ path: "deliveryPartnerReviewByRestaurant" })
//     .sort({ _id: -1 })
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Order.count({
//     restaurant: restaurantId,
//     paymentStatus: ["Paid", "COD"],
//     status: status,
//   });
//   const formattedLastSeen = formatAMPM(restaurant.lastSeen);

//   res.status(200).json({
//     status: "success",
//     message: "successfully",
//     data: order,
//     total,
//     formattedLastSeen: formattedLastSeen,
//   });
// });
exports.getAllOrder = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId, status } = req.query;
  console.log(req.query);
  const skip = page * limit - limit;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("No restaurant found", 404));
  }
  restaurant.lastSeen = new Date();
  await restaurant.save();
  const order = await Order.find({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: status,
    createdAt: { $lte: new Date(Date.now() - 1000 * 121) },
  })
    .populate({ path: "orderItems", populate: "item" })
    .populate({ path: "customer", select: "name , phone" })
    .populate({ path: "customerAddress" })
    .populate({ path: "deliveryPartner" })
    .populate({ path: "deliveryPartnerReviewByRestaurant" })
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: status,
  });
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: order, total });
});
exports.getDeliveredOrder = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId } = req.query;
  const skip = page * limit - limit;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("No restaurant found", 404));
  }
  const order = await Order.aggregate([
    {
      $match: {
        paymentStatus: {
          $in: ["COD", "Paid"],
        },
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        status: "Delivered",
      },
    },
    {
      $lookup: {
        from: "deliverypartnerreviewrestaurants",
        localField: "_id",
        foreignField: "order",
        as: "deliveryPartnerReview",
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    { $limit: limit * 1 },
    { $skip: skip * 1 },
  ]);
  await OrderItem.populate(order, {
    path: "orderItems",
  });
  await MenuItem.populate(order, {
    path: "orderItems.menuItem",
  });
  await Customer.populate(order, {
    path: "customer",
    select: "name , phone",
  });
  await Customer.populate(order, {
    path: "customer",
    select: "name , phone",
  });
  await Address.populate(order, {
    path: "customerAddress",
  });
  await DeliveryPartner.populate(order, {
    path: "deliveryPartner",
  });

  const total = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Delivered",
  });
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: order, total });
});

exports.callCustomer = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;

  const order = await Order.findById(orderId)
    .populate("customer")
    .populate("restaurant");

  const data = await axios.post(
    `https://api-smartflo.tatateleservices.com/v1/click_to_call`,
    {
      agent_number: order.restaurant.contactPersonPhone,
      destination_number: order.customer.phone,
      caller_id: process.env.CALLER_ID,
    },
    {
      headers: {
        Authorization: process.env.CALL_TOKEN,
      },
    }
  );
  res.status(200).json(data.data);
});

exports.callDelivery = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;

  const order = await Order.findById(orderId)
    .populate("deliveryPartner")
    .populate("restaurant");

  const data = await axios.post(
    `https://api-smartflo.tatateleservices.com/v1/click_to_call`,
    {
      agent_number: order.restaurant.contactPersonPhone,
      destination_number: order.deliveryPartner.phone,
      caller_id: process.env.CALLER_ID,
    },
    {
      headers: {
        Authorization: process.env.CALL_TOKEN,
      },
    }
  );
  res.status(200).json(data.data);
});

exports.getAllOrderCount = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("No restaurant found", 404));
  }
  let restaurantStatus = {};
  restaurantStatus = await RestaurantStatusModel.findOne({
    restaurant: restaurant._id,
  });
  console.log("dekho", restaurantStatus);
  if (restaurantStatus) {
    restaurantStatus.count = restaurantStatus.count + 1;
    await restaurantStatus.save();
  } else {
    await RestaurantStatusModel.create({
      restaurant: restaurant._id,
    });
  }

  restaurant.status = restaurantStatus._id;
  await restaurant.save();

  const totalPending = await Order.count({
    createdAt: { $lte: new Date(Date.now() - 1000 * 121) },
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Pending",
  });
  const totalPreparing = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Preparing",
  });
  const totalReject = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Reject",
  });
  const totalPickedUp = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Picked-up",
  });
  const totalCancelled = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Cancelled",
  });
  const totalDelivered = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Delivered",
  });
  const totalReady = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD"],
    status: "Ready",
  });

  res.status(200).json({
    status: "success",
    message: "successfully",
    totalPending,
    totalPreparing,
    totalReject,
    totalPickedUp,
    totalReady,
    totalCancelled,
    totalDelivered,
  });
});
exports.createCoupon = catchAsync(async (req, res) => {
  const restaurant_id = req.query.restaurant_id;

  if (!restaurant_id) {
    return res.status(204).json({
      status: "error",
      message: "Restaurant ID is required in the query parameters",
    });
  }
  if (!restaurant_id) {
    return next(new AppError("No restaurant found", 404));
  }
  const {
    code,
    applyCount,
    title,
    description,
    totalCount,
    expire,
    percentage,
    maxDiscount,
    newCustomer,
    minValue,
  } = req.body;

  const restaurant = await Restaurant.findById(restaurant_id);

  if (!restaurant) {
    return res.status(204).json({
      status: "error",
      message: "Restaurant not found",
    });
  }

  const coupon = await Coupon.create({
    code,
    couponType: "restaurant",
    restaurant: restaurant._id,
    applyCount,
    title,
    description,
    totalCount,
    expire,
    percentage,
    maxDiscount,
    newCustomer,
    minValue,
  });

  res.status(200).json({
    status: "success",
    message: "Restaurant Coupon Created successfully",
    data: coupon,
  });
});

// exports.editCoupon = catchAsync(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const {
//       code,

//       freeDelivery,
//       freeDeliveryApplyCount,
//       applyCount,
//       title,
//       description,
//       totalCount,
//       expire,
//       percentage,
//       maxDiscount,
//       newCustomer,
//       minValue,
//     } = req.body;

//     const result = await Coupon.findById(id);
//     if (!result) {
//       return next(new AppError("Coupon not found"));
//     }

//     // Check the coupon type and handle creation accordingly
//     if (couponType === "restaurant") {
//       if (freeDelivery) {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;
//         result.restaurant = restaurant;

//         result.applyCount = 1;

//         result.totalCount = 0;

//         result.percentage = 0;
//         result.maxDiscount = 0;

//         result.minValue = 0;

//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       } else {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;

//         result.applyCount = applyCount;

//         result.totalCount = totalCount;

//         result.percentage = percentage;
//         result.maxDiscount = maxDiscount;
//         result.restaurant = restaurant;
//         result.minValue = minValue;

//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       }
//     }

//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

exports.editCoupon = catchAsync(async (req, res) => {
  const {
    code,
    freeDelivery,
    freeDeliveryApplyCount,
    applyCount,
    title,
    description,
    totalCount,
    expire,
    percentage,
    maxDiscount,
    newCustomer,
    minValue,
  } = req.body;

  // Check if the request contains a coupon ID for editing
  const couponId = req.params.id;

  if (!couponId) {
    return res.status(400).json({
      status: "error",
      message: "Coupon ID is required for editing",
    });
  }

  // Find the existing coupon by ID
  const existingCoupon = await Coupon.findById(couponId);

  if (!existingCoupon) {
    return res.status(404).json({
      status: "error",
      message: "Coupon not found",
    });
  }

  // Update the existing coupon with the provided data
  existingCoupon.code = code;
  existingCoupon.freeDelivery = freeDelivery;
  existingCoupon.freeDeliveryApplyCount = freeDeliveryApplyCount;
  existingCoupon.applyCount = applyCount;
  existingCoupon.title = title;
  existingCoupon.description = description;
  existingCoupon.totalCount = totalCount;
  existingCoupon.expire = expire;
  existingCoupon.percentage = percentage;
  existingCoupon.maxDiscount = maxDiscount;
  existingCoupon.newCustomer = newCustomer;
  existingCoupon.minValue = minValue;

  // Save the updated coupon
  const updatedCoupon = await existingCoupon.save();

  res.status(200).json({
    status: "success",
    message: "Restaurant Coupon Updated successfully",
    data: updatedCoupon,
  });
});

exports.getCoupon = catchAsync(async (req, res, next) => {
  const currentDate = new Date();

  const { page, limit, sort, field, restaurantId } = req.query;
  const skip = page * limit - limit;

  const query = {
    couponType: "restaurant",
    expire: { $gt: currentDate },
  };

  if (restaurantId) {
    query.restaurant = restaurantId;
  }

  const coupons = await Coupon.find(query)
    .populate({
      path: "restaurant",
      select: "brand_display_name  ",
    })
    // .populate("restaurant")
    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Coupon.count(query);

  res.status(200).json({
    data: coupons,
    total,
    status: "success",
    message: "Successfully retrieved coupons by restaurant ID",
  });
});
// Import required modules and dependencies

// Assuming you have the necessary middleware and modules already set up

// DELETE request to delete a coupon by ID
// app.delete('/api/coupons/:couponId', async (req, res) => {
//   try {
//     const couponId = req.params.couponId;

//     // Use Mongoose to find the coupon by ID and remove it
//     const deletedCoupon = await Coupon.findByIdAndRemove(couponId);

//     if (!deletedCoupon) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Coupon not found',
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Coupon deleted successfully',
//       data: deletedCoupon,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//     });
//   }
// });

// Replace '/api/coupons/:couponId' with the appropriate route you want to use for deleting coupons.

// Make sure to secure this route with appropriate authentication and authorization middleware.

// exports.deleteCoupon=catchAsync(async(req,res,next)=>{
//   const coupon=await Coupon.findByIdAndDelete(req.params.id);
// if(!coupon){

// }
// })
exports.visibleCoupon = catchAsync(async (req, res, next) => {
  const { visible } = req.body;
  const { couponId } = req.query;

  await Coupon.findByIdAndUpdate(couponId, { visible });

  res.status(200).json({
    status: "success",
    message: "successfully",
  });
});
const get1min = () => {
  const d = new Date();
  // d.setMinutes(d.getMinutes() - 1);
  return new Date(d.getTime() - 1 * 60000);
  // return d;
};
// function areTimesWithin2MinutesDifference(time1, time2) {
//   const diffInMilliseconds = Math.abs(time1 - time2);
//   const twoMinutesInMilliseconds = 3 * 60 * 1000; // 3 minutes in milliseconds
//   return diffInMilliseconds <= twoMinutesInMilliseconds;
// }

// function areTimesWithin2MinutesDifference(time1, time2) {
//   const diffInMilliseconds = Math.abs(time1 - time2);
//   const twoMinutesInMilliseconds = 2 * 60 * 1000; // 2 minutes in milliseconds
//   return diffInMilliseconds <= twoMinutesInMilliseconds;
// }

// function areTimesWithin2MinutesDifference(time1, time2) {
//   const diffInMilliseconds = Math.abs(time1 - time2);
//   const twoMinutesInMilliseconds = 2 * 1000; // 2  milliseconds
//   return diffInMilliseconds <= twoMinutesInMilliseconds;
// }
function areTimesWithin2MinutesDifference(time1, time2) {
  const diffInMilliseconds = Math.abs(time1 - time2);
  const twoMinutesInMilliseconds = 1 * 60 * 1000; // 1 minutes in milliseconds
  return diffInMilliseconds <= twoMinutesInMilliseconds;
}

exports.acceptOrder = catchAsync(async (req, res, next) => {
  const { preparationTime, orderId } = req.body;
  console.log("Received acceptOrder request for orderId:", orderId);

  const order = await Order.findById(orderId)
    .populate("customer")
    .populate("restaurant");
  const time1 = new Date(order.createdAt);
  const time2 = new Date();
  if (!order) {
    return next(new AppError("No order found", 404));
  }

  if (areTimesWithin2MinutesDifference(time1, time2)) {
    return next(new AppError("Wait", 404));
  }

  if (order.status !== "Pending") {
    return next(new AppError("The order already  Handled ", 404));
  }
  // console.log(order.restaurant.location.coordinates);

  sendNotification(
    "Your order is preparing",
    // "body",
    "Tap to Open",

    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  if (preparationTime) {
    order.preparationTime = preparationTime;
  }
  order.acceptedAt = new Date();
  const findNearestDeliveryPartner = await DeliveryPartnerCurrentLocation.find({
    location: {
      $near: {
        // $maxDistance: 500000 * 1000,
        $maxDistance: 8000,
        $geometry: {
          type: "Point",
          coordinates: order.restaurant.location.coordinates,
        },
      },
    },
    available: true,
    locationUpdatedAt: { $gt: new Date(get1min()) },
  }).limit(10);
  console.log("findNearestDeliveryPartner:", findNearestDeliveryPartner.length);
  const availableDeliveryPartner = [];
  for (let index = 0; index < findNearestDeliveryPartner.length; index++) {
    const element = findNearestDeliveryPartner[index];
    availableDeliveryPartner.push(element.deliveryPartner);
  }
  await SearchDeliveryPartner.create({
    order: order._id,
    availableDeliveryPartner,
  });
  order.status = "Preparing";
  await order.save();
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: order });
});

exports.rejectOrder = catchAsync(async (req, res, next) => {
  const { orderId, rejectionReject } = req.body;

  const order = await Order.findById(orderId).populate("customer");
  if (!order) {
    return next(new AppError("No order found", 404));
  }
  if (order.status !== "Pending") {
    return next(new AppError("The order already  Handled ", 404));
  }

  order.rejectAt = new Date();

  order.status = "Reject";
  order.rejectionReject = rejectionReject;

  await order.save();

  sendNotification(
    "Your order is Rejected",
    `Rejection due to ${rejectionReject}`,
    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: order });
});

exports.readyOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("customer");
  if (!order) {
    return next(new AppError("No order found", 404));
  }
  if (order.status !== "Preparing") {
    return next(new AppError("The order already Handled ", 404));
  }

  sendNotification(
    "Your order is Ready",
    // "body",
    "Tap to Open",

    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  order.readyAt = Date.now();
  order.status = "Ready";
  await order.save();
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: order });
});

exports.getComplain = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId } = req.query;
  const skip = page * limit - limit;
  const complain = await OrderComplain.find({
    restaurant: restaurantId,
    complainStatus: "created",
  })
    .populate({
      path: "order",
      populate: { path: "orderItems", populate: "menuItem" },
    })
    .populate({
      path: "order",
      populate: { path: "customer", select: "name , phone" },
    })
    .populate({ path: "order", populate: { path: "customerAddress" } })
    .populate({ path: "order", populate: { path: "deliveryPartner" } })
    .sort({ _id: -1 })
    .limit(limit || 10)
    .skip(skip);
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: complain });
});

exports.getAcceptedComplain = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId } = req.query;
  const skip = page * limit - limit;
  const complain = await OrderComplain.find({
    restaurant: restaurantId,
    complainStatus: "accepted",
  })
    .populate({
      path: "order",
      populate: { path: "orderItems", populate: "menuItem" },
    })
    .populate({
      path: "order",
      populate: { path: "customer", select: "name , phone" },
    })
    .populate({ path: "order", populate: { path: "customerAddress" } })
    .populate({ path: "order", populate: { path: "deliveryPartner" } })
    .sort({ _id: -1 })
    .limit(limit || 10)
    .skip(skip);
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: complain });
});

exports.getComplainHistory = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId } = req.query;
  const skip = page * limit - limit;
  const complain = await OrderComplain.find({
    restaurant: restaurantId,
    complainStatus: "completed",
  })
    .populate({
      path: "order",
      populate: { path: "orderItems", populate: "menuItem" },
    })
    .populate({
      path: "order",
      populate: { path: "customer", select: "name , phone" },
    })
    .populate({ path: "order", populate: { path: "customerAddress" } })
    .populate({ path: "order", populate: { path: "deliveryPartner" } })
    .sort({ _id: -1 })
    .limit(limit || 10)
    .skip(skip);
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: complain });
});

exports.updateComplain = catchAsync(async (req, res, next) => {
  const { complainId, paymentAccept, restaurantDescription } = req.body;

  const complain = await OrderComplain.findById(complainId);
  if (paymentAccept) {
    complain.paymentAccept = paymentAccept;
    complain.complainStatus = "accepted";
  } else {
    complain.restaurantDescription = restaurantDescription;
    complain.complainStatus = "rejected";
  }

  await complain.save();
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: complain });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.query.restaurantId)
    .populate("attributes")
    .populate("bankDetail")
    .populate("variations")
    .populate("addongroups")
    .populate("items")
    .populate("categories")
    .populate("taxes");
  res.status(200).json({
    restaurant,
    status: "success",
    message: " successfully",
  });
});
// exports.deleteCoupon = catchAsync(async (req, res, next) => {
//   // const couponId = await Coupon.findById(req.query.couponId);
//   const couponId = req.query.couponId;

//   if (!couponId) {
//     return res.status(404).json({
//       status: "fail",
//       message: "couponId not found",
//     });
//   }
//   // const { couponId } = req.params;
//   const deleteCoupon = await Coupon.findByIdAndDelete(couponId);
//   if (!deleteCoupon) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Coupon not found",
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     data: deleteCoupon,
//     message: "successfully deleted Coupon ",
//   });
// });

// exports.deleteCoupon = catchAsync(async (req, res, next) => {
//   const { couponId } = req.query;

//   try {
//     // Soft delete by updating the 'deleted' field to true
//     const deletedCoupon = await Coupon.findByIdAndUpdate(
//       couponId,
//       { $set: { deleted: true } },
//       { new: true }
//     );

//     if (!deletedCoupon) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Coupon not found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       data: deletedCoupon,
//       message: "Coupon soft-deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting coupon:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Internal Server Error",
//     });
//   }
// });
//softdelete
// exports.deleteCoupon = catchAsync(async (req, res, next) => {
//   const { couponId } = req.params;

//   // Soft delete by updating the 'deleted' field to true
//   const deletedCoupon = await Coupon.findByIdAndUpdate(
//     couponId,
//     { $set: { deleted: true } },
//     { new: true }
//   );

//   if (!deletedCoupon) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Coupon not found",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: deletedCoupon,
//     message: "Coupon soft-deleted successfully",
//   });
// });
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { couponId } = req.params;

  // Soft delete by updating the 'deleted' field to true
  const deletedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    { $set: { deleted: true } },
    { new: true }
  );

  if (!deletedCoupon) {
    return res.status(404).json({
      status: "fail",
      message: "Coupon not found",
    });
  }

  // Check if the deletedCoupon has 'deleted' set to true
  if (deletedCoupon.deleted) {
    return res.status(200).json({
      status: "success",
      data: deletedCoupon,
      message: "Coupon soft-deleted successfully",
    });
  } else {
    // If 'deleted' is not true, don't include it in the response
    return res.status(200).json({
      status: "success",
      message: "Coupon not found",
    });
  }
});

exports.getRestaurantOrdersByTimePeriod = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  if (!restaurantId) {
    return next(new AppError("Please provide a restaurantId", 400));
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("No restaurant found", 404));
  }

  const orders = await Order.find({
    restaurant: restaurant,
    status: "Delivered",
  })
    .select(
      "orderId  customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus pet"
    )
    .populate({
      path: "orderItems",
      select: "totalPrice itemTitle quantity",
    })
    .populate({ path: "coupon", select: "code couponType" })
    .populate({ path: "restaurant", select: "bankDetail pan_no" })
    .populate("deliveredAt");

  for (const order of orders) {
    const couponType = await Coupon.findById(order.coupon);

    const existingReport = await OrderReportCalculation.findOne({
      deliveredOrderId: order._id,
    });

    if (!existingReport) {
      if (order.deliveryStatus === "Delivered") {
        function financial(x) {
          return Number.parseFloat(x).toFixed(2);
        }

        let bankId = order.restaurant.bankDetail;
        let petpooja = order.restaurant.petPooja;
        let tdsOnAmountPayable = 0;
        let YbitesCommission = 0;
        let restaurantAfterDiscountPrice = 0;
        let gstOnMenuCustomer = 0;
        let ybitesAfterDiscountPrice = 0;
        let totalAmountPayable = 0;
        let ybitesCollection = 0;
        let gstOnCommissionRestaurant = 0;
        if (order.petpooja === true) {
          YbitesCommission = (order.totalPrice * 8) / 100;
        } else {
          YbitesCommission = (order.totalPrice * 15) / 100;
        }
        console.log(`YbitesCommission:${(order.totalPrice * 15) / 100}`);

        //try
        gstOnCommissionRestaurant = (YbitesCommission * 18) / 100;
        // after discount price of restaurant or ybites

        if (couponType !== null) {
          if (couponType.couponType === "restaurant") {
            restaurantAfterDiscountPrice = order.totalPrice - order.discount;
            gstOnMenuCustomer = Number(restaurantAfterDiscountPrice * 5) / 100;
            YbitesCommission = (restaurantAfterDiscountPrice * 15) / 100;
            gstOnCommissionRestaurant = (YbitesCommission * 18) / 100;
            console.log("gstOnMenuCustomer restaurant", gstOnMenuCustomer);

            totalAmountPayable =
              Number(order.totalPrice) -
              Number(YbitesCommission) -
              Number(gstOnCommissionRestaurant) -
              Number(order.discount);
          } else if (couponType.couponType === "admin") {
            ybitesAfterDiscountPrice = order.totalPrice - order.discount;
            gstOnMenuCustomer = (ybitesAfterDiscountPrice * 5) / 100;
            totalAmountPayable =
              order.totalPrice - YbitesCommission - gstOnCommissionRestaurant;
            console.log("ybitesAfterDiscountPrice", ybitesAfterDiscountPrice);
          }
        } else {
          gstOnMenuCustomer = (order.grandTotalPrice * 5) / 100;
          totalAmountPayable =
            order.totalPrice - YbitesCommission - gstOnCommissionRestaurant;
        }

        // after discount price of restaurant or ybites
        console.log(`------restaurant------:${order.restaurant.pan_no}`);
        if (
          order.restaurant.pan_no.charAt(3) === "F" ||
          order.restaurant.pan_no.charAt(3) === "C"
        ) {
          tdsOnAmountPayable = Number(totalAmountPayable * 2) / 100;
        } else {
          tdsOnAmountPayable = Number(totalAmountPayable * 1) / 100;
        }
        let netPayableAmount = totalAmountPayable - tdsOnAmountPayable;
        let gstOnDelivery = (order.deliveryCharge / 118) * 18;
        let gstOnPackingCharge = (order.packagingCharge / 118) * 18;
        let totalGst =
          gstOnMenuCustomer +
          gstOnCommissionRestaurant +
          gstOnDelivery +
          gstOnPackingCharge;
        let totalTds = tdsOnAmountPayable;
        let actualAmountCollectedOnMenu = 0;
        if (restaurantAfterDiscountPrice > 0) {
          actualAmountCollectedOnMenu = restaurantAfterDiscountPrice;
        } else if (ybitesAfterDiscountPrice > 0) {
          actualAmountCollectedOnMenu = ybitesAfterDiscountPrice;
        } else {
          actualAmountCollectedOnMenu = order.totalPrice;
        }
        if (couponType !== null) {
          if (couponType.couponType === "restaurant") {
            ybitesCollection =
              actualAmountCollectedOnMenu +
              order.deliveryCharge +
              order.packagingCharge +
              gstOnMenuCustomer;
            console.log("ybitesCollection restaurant", ybitesCollection);
            console.log("gstOnMenuCustomer restaurant", gstOnMenuCustomer);
          } else if (couponType.couponType === "admin") {
            ybitesCollection =
              actualAmountCollectedOnMenu +
              order.deliveryCharge +
              order.packagingCharge +
              gstOnMenuCustomer;
            console.log("ybitesCollection  admin", ybitesCollection);
            console.log("gstOnMenuCustomer  admin", gstOnMenuCustomer);
          }
        } else {
          ybitesCollection =
            actualAmountCollectedOnMenu +
            order.deliveryCharge +
            order.packagingCharge +
            gstOnMenuCustomer;
          console.log("ybitesCollection  ", ybitesCollection);
          console.log("gstOnMenuCustomer  ", gstOnMenuCustomer);
        }
        let deduction = 0;
        let profit = 0;

        deduction =
          totalGst + totalTds + order.deliveryBoyShare + netPayableAmount;
        profit = ybitesCollection - deduction;

        //try

        const createdReports = await OrderReportCalculation.create({
          deliveredOrderId: order._id,
          couponType: couponType ? couponType._id : null,
          restaurantAfterDiscountPrice: restaurantAfterDiscountPrice,
          ybitesAfterDiscountPrice: ybitesAfterDiscountPrice,
          actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
          restaurantId: order.restaurant,
          deliveryPartnerId: order.deliveryPartner,
          customerId: order.customer,
          bankDetails: bankId,
          petPooja: petpooja,
          YbitesCommission: financial(YbitesCommission),
          gstOnCommissionRestaurant: financial(gstOnCommissionRestaurant),
          totalAmountPayable: financial(totalAmountPayable),
          tdsOnAmountPayable: financial(tdsOnAmountPayable),
          netPayableAmount: financial(netPayableAmount),
          gstOnDelivery: financial(gstOnDelivery),
          gstOnPackingCharge: financial(gstOnPackingCharge),
          gstOnMenuCustomer: financial(gstOnMenuCustomer),
          totalGst: financial(totalGst),
          totalTds: financial(totalTds),
          ybitesCollection: financial(ybitesCollection),
          deduction: financial(deduction),
          profit: financial(profit),
        });
      }
    }
  }
  //try

  const filter = req.query.filter;
  let startDate, endDate;

  if (filter === "today") {
    startDate = startOfDay(new Date());
    endDate = endOfDay(new Date());
  } else if (filter === "week") {
    startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  } else if (filter === "month") {
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
  } else {
    startDate = startOfDay(new Date());
    endDate = endOfDay(new Date());
  }

  //try
  const report = await OrderReportCalculation.find({
    restaurantId: restaurantId,
  }).populate({
    path: "deliveredOrderId",
    model: "Order",
    populate: [
      { path: "orderId orderItems", select: "itemTitle price quantity" },
      { path: "coupon", select: "code couponType" },
      {
        path: "restaurant",
        select: " petPooja couponType brand_display_name ",
      },
    ],
    select:
      "  updatedAt createdAt deliveryBoyShare paymentAmount discount packagingCharge deliveryTip grandTotalTaxes totalTaxes totalPrice grandTotalPrice paymentMode deliveryStatus status deliveryCharge deliveredAt",
  });

  const filteredReport = report.filter((item) => {
    const deliveredAt = new Date(item.deliveredOrderId.deliveredAt);
    return deliveredAt >= startDate && deliveredAt <= endDate;
  });
  const totalNetPayableAmount = filteredReport
    .reduce((sum, order) => sum + parseFloat(order.netPayableAmount), 0)
    .toFixed(2);
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved delivered orders",
    // data: orders,
    totalNetPayableAmount: totalNetPayableAmount,
    // report: report,
    filteredReport: filteredReport,
  });
});
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const base64Img = require("base64-img");
const OrderReportCalculation = require("../../models/restaurant/OrderReportsCalculation");

exports.getRestaurantOrdersByDateRange = async (req, res, next) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return next(new AppError("Please provide a restaurantId", 400));
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return next(new AppError("No restaurant found", 404));
    }

    const report = await OrderReportCalculation.find({
      restaurantId: restaurantId,
    })
      .populate({
        path: "deliveredOrderId",
        model: "Order",
        select: "deliveredAt orderId orderItems grandTotalPrice",
      })
      .populate({
        path: "deliveredOrderId",
        model: "Order",
        populate: [
          { path: "orderItems", select: "itemTitle price quantity" },
          { path: "coupon", select: "code couponType" },
          {
            path: "restaurant",
            select: "bankDetail petPooja couponType ",
          },
        ],
      });

    // .populate({ path: "couponType", select: "code couponType" })
    // .populate({ path: "restaurantId", select: "pan_no" });

    const filteredReport = report.filter((item) => {
      const deliveredAt = new Date(item.deliveredOrderId.deliveredAt);
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      return deliveredAt >= parsedStartDate && deliveredAt <= parsedEndDate;
    });
    const logoDataUrl = base64Img.base64Sync("./ylogo.jpg");

    const documentDefinition = {
      content: [
        {
          image: logoDataUrl,
          width: 120,
          height: 100,
          margin: [0, 0],
        },
        {
          text: `${startDate} to ${endDate}`,
          fontSize: 12,
          alignment: "right",
          margin: [0, 0],
        },
        {
          text: `${restaurant.brand_display_name} Billing Report`,
          fontSize: 18,
          alignment: "center",
          margin: [5, 10],
        },

        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: [
              "auto",
              75,
              // "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                "Order ID",
                "Item",
                // "Price",
                "Grand Total Price",
                "discount",
                "ybites Discount Price",
                "Restaurant Discount Price",
                "deduction",
                "totalTds",
                "Payment to Restaurant ",
              ],
              ...filteredReport.flatMap((order) => {
                const orderItems = order.deliveredOrderId.orderItems;

                // Map each order item to a row in the table
                return orderItems.map((item, index) => [
                  index === 0
                    ? getNestedValue(order, "deliveredOrderId.orderId")
                    : "",
                  getNestedValue(item, "itemTitle"),
                  // getNestedValue(item, "price"),
                  index === 0
                    ? getNestedValue(order, "deliveredOrderId.grandTotalPrice")
                    : "",
                  index === 0
                    ? getNestedValue(
                        order,
                        "deliveredOrderId.discount"
                      ).toFixed(2)
                    : "",
                  index === 0
                    ? getNestedValue(order, "ybitesAfterDiscountPrice")
                    : "",
                  // index === 0
                  //   ? formatDate(
                  //       getNestedValue(order, "deliveredOrderId.deliveredAt")
                  //     )
                  //   : "",
                  index === 0
                    ? getNestedValue(order, "restaurantAfterDiscountPrice")
                    : "",
                  index === 0 ? getNestedValue(order, "deduction") : "",
                  index === 0 ? getNestedValue(order, "totalTds") : "",
                  index === 0 ? getNestedValue(order, "netPayableAmount") : "",
                ]);
              }),
            ],
          },
        },
      ],

      footer: {
        columns: [
          {
            text: "*This is an auto-generated bill, which does not require any stamp or signature",
            alignment: "center",
            fontSize: 8,
            bold: false,
          },
        ],
      },
    };

    // Helper function to safely get nested values
    function getNestedValue(obj, path) {
      const keys = path.split(".");
      return keys.reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""),
        obj
      );
    }

    const pdfDoc = pdfMake.createPdf(documentDefinition);

    pdfDoc.getBuffer((buffer) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Billing Reports.pdf"'
      );
      res.end(buffer);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: {
        statusCode: 500,
        status: "error",
      },
      message: error.message || "Internal Server Error",
    });
  }
};
