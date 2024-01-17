const appError = require("./../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order/orderModel");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const DeliveryPartnerOrderData = require("../../models/deliveryPartner/deliveryPartnerOrderData");
const request = require("postman-request");
const AppError = require("./../../utils/appError");
const { sendNotification } = require("../../config/firebase");
const SearchDeliveryPartner = require("../../models/order/searchDeliveryPartner");
const moment = require('moment-timezone');

const get10min = () => {
  const d = new Date();
  return new Date(d.getTime() - 10 * 60000);
};
const get1min = () => {
  const d = new Date();
  // d.setMinutes(d.getMinutes() - 1);
  return new Date(d.getTime() - 1 * 60000);
  // return d;
};
const get2min = () => {
  const d = new Date();
  return new Date(d.getTime() + 2 * 60000);
};

const get4sec = () => {
  const d = new Date();
  return new Date(d.getTime() - 40000);
};
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// exports.getOrders = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const order = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   })
  
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja city ",
//     })
//     .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })

//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
//     })
//     // .populate({ path: "orderItems", select: "itemTitle" })
//     .populate({ path: "customerAddress", select: "location" })
//     .populate({ path: "coupon", select: "code" })

//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);
//   // console.log(`check menu Q: ${order}`);
//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   });

//   // shivam------------------------------------------------
//   // for (let index = 0; index < order.orderItems.length; index++) {
//   //   const element = order.orderItems[index];
//   //   console.log(element);
//   // }

//   let data = JSON.stringify(order, null, 4);
//   console.log(data.deliveryStatus);

//   // shivam------------------------------------------------

//   res
//     .status(200)
//     .json({ data: order, total, status: "success", message: "successfully" });
// });
//try
// exports.getOrders = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field,restaurantCity,createdTime,deliveredDate, paymentMode,couponType ,platform,createdAt,createdDate,status } = req.query;
//   const skip = page * limit - limit;

//   const orders = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   })
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja city",
//     })
//     .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })
//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
//     })
//     .populate({ path: "customerAddress", select: "location" })
//     .populate({ path: "coupon", select: "code couponType" })
//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);


//   let filteredOrders = orders;

//   if (restaurantCity) {
//     filteredOrders = orders.filter(order => order.restaurant.city.toLowerCase() === restaurantCity.trim().toLowerCase());
//   }

//   if (paymentMode) {
//     filteredOrders = filteredOrders.filter(order => order.paymentMode.toLowerCase() === paymentMode.trim().toLowerCase());
//   }
// if (couponType) {
//     filteredOrders = orders.filter(order => order.coupon && order.coupon.couponType && (order.coupon.couponType.toLowerCase() === couponType.toLowerCase()));
//   }


//   if (deliveredDate) {
//     filteredOrders = filteredOrders.filter(order => {
//         const [day, month, year] = deliveredDate.split('-'); // Fix: Use deliveredDate instead of createdDate
//         const formateDate = new Date(`${year}-${month}-${day}`);

//         const orderDate = new Date(order.createdAt).toISOString().split('T')[0];

//         return orderDate === formateDate.toISOString().split('T')[0];
//     });
// }

//   if (createdDate) {
//     filteredOrders = filteredOrders.filter(order => {
//       const [day, month, year] = createdDate.split('-');
//       const formateDate = new Date(`${year}-${month}-${day}`);
  
//       const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
  
//       return orderDate === formateDate.toISOString().split('T')[0];
//     });
//   }
//   if (createdTime) {
//     const targetTime = createdTime.trim();
//     filteredOrders = filteredOrders.filter(order => {
//         const orderTime = new Date(order.createdAt).toLocaleTimeString('en-US', { hour12: false });
//         return orderTime.startsWith(targetTime);
//     });
// }


//   if (status) {
//     filteredOrders = filteredOrders.filter(order => order.status === status);
//   }
  

//   filteredOrders = platform === 'petPooja'
//   ? orders.filter(order => order.restaurant.petPooja)
//   : platform === 'ybites'
//     ? orders.filter(order => !order.restaurant.petPooja)
//     : filteredOrders;

// filteredOrders = couponType === 'admin'
//   ? orders.filter(order => order.coupon && order.coupon.couponType === couponType)
//   : couponType === 'restaurant'
//   ? orders.filter(order => order.coupon && order.coupon.couponType === couponType)
//   : filteredOrders

  
//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   });

//   res.status(200).json({
//     data: filteredOrders,
//     total:filteredOrders.length,
//     status: "success",
//     message: "successfully",
//   });
// });
// exports.getOrders = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field,paymentStatus, deliveryStatus,city,orderId, createdTime, deliveredDate, paymentMode, couponType, platform, createdDate, status } = req.query;
//   const skip = page * limit - limit;

//   const orders = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   })
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja city",
//     })
//     .populate({
//       path: 'orderItems',
//       select: 'item itemTitle totalPrice quantity',
//       populate: {
//         path: 'item',
//         select: 'bhiwandiItemPrice  ',
//       },
//     })
    
//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
//     })
//     .populate({ path: "customerAddress", select: "location" })
//     .populate({ path: "coupon", select: "code couponType" })
//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   let filteredOrders = orders;

//   if (city) {
//     filteredOrders = filteredOrders.filter(order => order.restaurant.city.toLowerCase() === city.trim().toLowerCase());
//   }
//   if (orderId) {
//     filteredOrders = filteredOrders.filter(order => order.orderId === parseInt(orderId));
//   }
//   if (paymentMode) {
//     filteredOrders = filteredOrders.filter(order => order.paymentMode.toLowerCase() === paymentMode.trim().toLowerCase());
//   }

//   if (couponType) {
//     filteredOrders = filteredOrders.filter(order => order.coupon && order.coupon.couponType && (order.coupon.couponType.toLowerCase() === couponType.toLowerCase()));
//   }

//   if (deliveredDate) {
//     const [day, month, year] = deliveredDate.split('-');
//     const formateDate = new Date(`${year}-${month}-${day}`);
//     filteredOrders = filteredOrders.filter(order => {
//       const orderDate = new Date(order.deliveredAt).toISOString().split('T')[0];
//       return orderDate === formateDate.toISOString().split('T')[0];
//     });
//   }
  
//   if (createdDate) {
//     const [day, month, year] = deliveredDate.split('-');
//     const formateDate = new Date(`${year}-${month}-${day}`);
//     filteredOrders = filteredOrders.filter(order => {
//       const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
//       return orderDate === formateDate.toISOString().split('T')[0];
//     });
//   }



//   if (createdTime) {
//     const targetTime = createdTime.trim();
//     console.log("targetTime", targetTime);
    
//     filteredOrders = filteredOrders.filter(order => {
//       const orderTime = moment(order.createdAt).tz('Asia/Kolkata').format('hh:mm');
//       return orderTime === targetTime;
//     });
//   }
  
  
//   if (platform) {
//     filteredOrders = platform === 'petPooja'
//       ? filteredOrders.filter(order => order.restaurant.petPooja)
//       : platform === 'ybites'
//         ? filteredOrders.filter(order => !order.restaurant.petPooja)
//         : filteredOrders;
//   }

//   if (couponType) {
//     filteredOrders = couponType === 'admin'
//       ? filteredOrders.filter(order => order.coupon && order.coupon.couponType === couponType)
//       : couponType === 'restaurant'
//         ? filteredOrders.filter(order => order.coupon && order.coupon.couponType === couponType)
//         : filteredOrders;
//   }

//   if (status) {
//     filteredOrders = filteredOrders.filter(order => order.status === status);
//   }

//   if (deliveryStatus) {
//     filteredOrders = filteredOrders.filter(order => order.deliveryStatus === deliveryStatus);
//   }

//   if (paymentStatus) {
//     filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
//   }
//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   });

//   res.status(200).json({
//     data: filteredOrders,
//     total: filteredOrders.length,
//     status: "success",
//     message: "successfully",
//   });
// });
exports.getOrders = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, deliveredDate,paymentStatus, deliveryStatus, city, orderId, createdTime, startDate, endDate, paymentMode, couponType, platform, createdDate, status } = req.query;
  const skip = page * limit - limit;

  const query = {
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
  };

  if (startDate && endDate) {
    query.deliveredAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const orders = await Order.find(query)
    .populate({
      path: "restaurant",
      select: "brand_display_name merchant_number location petPooja city",
    })
    .populate({
      path: 'orderItems',
      select: 'item itemTitle totalPrice quantity',
      populate: {
        path: 'item',
        select: 'bhiwandiItemPrice',
      },
    })
    .populate({ path: "customer", select: "name phone" })
    .populate({
      path: "deliveryPartner",
      select: "name phone",
      populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
    })
    .populate({ path: "customerAddress", select: "location" })
    .populate({ path: "coupon", select: "code couponType" })
    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  let filteredOrders = orders;

  if (city) {
    filteredOrders = filteredOrders.filter(order => order.restaurant.city.toLowerCase() === city.trim().toLowerCase());
  }
  if (orderId) {
    filteredOrders = filteredOrders.filter(order => order.orderId === parseInt(orderId));
  }
  if (paymentMode) {
    filteredOrders = filteredOrders.filter(order => order.paymentMode.toLowerCase() === paymentMode.trim().toLowerCase());
  }

  if (couponType) {
    filteredOrders = filteredOrders.filter(order => order.coupon && order.coupon.couponType && (order.coupon.couponType.toLowerCase() === couponType.toLowerCase()));
  }

  if (deliveredDate) {
    const [day, month, year] = deliveredDate.split('-');
    const formateDate = new Date(`${year}-${month}-${day}`);
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.deliveredAt).toISOString().split('T')[0];
      return orderDate === formateDate.toISOString().split('T')[0];
    });
  }
  
  if (createdDate) {
    const [day, month, year] = deliveredDate.split('-');
    const formateDate = new Date(`${year}-${month}-${day}`);
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === formateDate.toISOString().split('T')[0];
    });
  }



  if (createdTime) {
    const targetTime = createdTime.trim();
    console.log("targetTime", targetTime);
    
    filteredOrders = filteredOrders.filter(order => {
      const orderTime = moment(order.createdAt).tz('Asia/Kolkata').format('hh:mm');
      return orderTime === targetTime;
    });
  }
  
  
  if (platform) {
    filteredOrders = platform === 'petPooja'
      ? filteredOrders.filter(order => order.restaurant.petPooja)
      : platform === 'ybites'
        ? filteredOrders.filter(order => !order.restaurant.petPooja)
        : filteredOrders;
  }

  if (couponType) {
    filteredOrders = couponType === 'admin'
      ? filteredOrders.filter(order => order.coupon && order.coupon.couponType === couponType)
      : couponType === 'restaurant'
        ? filteredOrders.filter(order => order.coupon && order.coupon.couponType === couponType)
        : filteredOrders;
  }

  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  if (deliveryStatus) {
    filteredOrders = filteredOrders.filter(order => order.deliveryStatus === deliveryStatus);
  }

  if (paymentStatus) {
    filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
  }
 
const total = await Order.count(query);

  res.status(200).json({
    data: filteredOrders,
    total: filteredOrders.length,
    status: "success",
    message: "successfully",
  });
});








//dsf
// exports.getOrders = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const orders = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   })
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja city",
//     })
//     .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })
//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
//     })
//     .populate({ path: "customerAddress", select: "location" })
//     .populate({ path: "coupon", select: "code couponType" })
//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const { restaurantCity, paymentMode,couponType ,platform,createdAt,createdDate, createdTime,status} = req.query;
//   let filteredOrders = orders;
//   if (restaurantCity) {
//     filteredOrders = filteredOrders.filter(order => order.restaurant.city.toLowerCase() === restaurantCity.trim().toLowerCase());
//   }


//   if (paymentMode) {
//     filteredOrders = orders.filter(order => order.paymentMode.toLowerCase() === paymentMode.trim().toLowerCase());
//   }



 

//   if (createdAt) {
//     const createdAtDate = new Date(createdAt);
//     filteredOrders = orders.filter(order => order.createdAt && new Date(order.createdAt) >= createdAtDate);
//   }
//   //year/month/day

//   if (createdDate) {
//     filteredOrders = filteredOrders.filter(order => {
//       const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
//       return orderDate === createdDate;
//     });
//   }
    
//   if (status) {
//     filteredOrders = filteredOrders.filter(order => order.status === status);
//   }

//   filteredOrders = platform === 'petPooja'
//   ? orders.filter(order => order.restaurant.petPooja)
//   : platform === 'ybites'
//   ? orders.filter(order => !order.restaurant.petPooja)
//   : orders;


// filteredOrders = couponType === 'admin'
//   ? orders.filter(order => order.coupon && order.coupon.couponType === couponType)
//   : couponType === 'restaurant'
//   ? orders.filter(order => order.coupon && order.coupon.couponType === couponType)
//   : orders

//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   });

//   res.status(200).json({
//     data: filteredOrders,
//     total:filteredOrders.length,
//     status: "success",
//     message: "successfully",
//   });
// });
//dfd


// exports.getOrderReport = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const order = await Order.find({ status: "Delivered" })
//     .populate({
//       path: "restaurant",
//       select:
//         "brand_display_name merchant_number location petPooja pan_no bankDetail",
//     })
//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: {
//         path: "deliveryPartnerCurrentLocation",
//         select: "location",
//       },
//     })
//     .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })
//     .populate({ path: "customerAddress", select: "location" })
//     .populate({ path: "coupon", select: "code" })
//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   });

//   let data = JSON.stringify(order, null, 4);
//   console.log(data.deliveryStatus);

//   res
//     .status(200)
//     .json({ data: order, total, status: "success", message: "successfully" });
// });
exports.getOrderReport = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, startDate, endDate } = req.query;
  const skip = page * limit - limit;

  const dateFilter = {};

  if (startDate !== "null" && endDate !== "null") {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (!isNaN(startDateObj) && !isNaN(endDateObj)) {
      dateFilter.createdAt = {
        $gte: startDateObj,
        $lte: endDateObj,
      };
    } else {
      return res
        .status(400)
        .json({ error: "Invalid date format for startDate or endDate." });
    }
  }
  const order = await Order.find({
    status: "Delivered",
    ...dateFilter,
  })
    .populate({
      path: "restaurant",
      select:
        "brand_display_name merchant_number location petPooja pan_no bankDetail",
      populate: {
        path: "bankDetail",
      },
    })
    .populate({ path: "customer", select: "name phone" })
    .populate({
      path: "deliveryPartner",
      select: "name phone",
      populate: {
        path: "deliveryPartnerCurrentLocation",
        select: "location",
      },
    })
    .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })
    .populate({ path: "customerAddress", select: "location" })
    .populate({ path: "coupon", select: "code" })
    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Order.count({
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    ...dateFilter,
  });

  res
    .status(200)
    .json({ data: order, total, status: "success", message: "successfully" });
});

exports.searchOrderFilter = async (req, res) => {
  try {
    const { key, value } = req.body;
    const query = key === "orderId" ? value * 1 : value;
    const run =
      key === "orderId"
        ? { orderId: query }
        : { $or: [{ [key]: { $regex: query } }] };
    // console.log(key, value, query);
    const order = await Order.find({
      ...run,
      paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    })
    .populate({
      path: "restaurant",
      select: "brand_display_name merchant_number location petPooja city",
    })
    .populate({ path: "orderItems", select: "itemTitle totalPrice quantity" })
    .populate({ path: "customer", select: "name phone" })
    .populate({
      path: "deliveryPartner",
      select: "name phone",
      populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
    })
    .populate({ path: "customerAddress", select: "location" })
    .populate({ path: "coupon", select: "code couponType" })
      .limit(20);

    res.status(200).json({
      status: "success",
      message: "successfully",
      data: order,
      total: order.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPendingOrders = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  console.log(new Date(get10min()));

  const order = await Order.find({
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    status: "Pending",
    createdAt: { $lt: new Date(get10min()) },
  })
    .populate({
      path: "restaurant",
      select: "brand_display_name merchant_number location petPooja",
    })
    .populate({ path: "customer", select: "name phone" })
    .populate({ path: "deliveryPartner", select: "name phone" })
    .populate({ path: "orderItems", select: "menuItemTitle" })

    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Order.count({
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    status: "Pending",
    createdAt: { $lt: new Date(get10min()) },
  });
  res
    .status(200)
    .json({ data: order, total, status: "success", message: "successfully" });
});

exports.getNoDeliveryOrders = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const order = await Order.find({
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    deliveryStatus: "Searching",
    status: ["Preparing", "Ready"],
    acceptedAt: { $lt: new Date(get10min()) },
  })
    .populate({
      path: "restaurant",
      select: "brand_display_name merchant_number location petPooja",
    })
    .populate({ path: "customer", select: "name phone" })
    .populate({ path: "deliveryPartner", select: "name phone" })
    .populate({ path: "orderItems", select: "menuItemTitle" })

    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Order.count({
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    deliveryStatus: "Searching",
    status: ["Preparing", "Ready"],
    acceptedAt: { $lt: new Date(get10min()) },
  });
  res
    .status(200)
    .json({ data: order, total, status: "success", message: "successfully" });
});
// exports.getNoDeliveryOrders = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const order = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//     deliveryStatus: "Searching",
//     status: ["Preparing", "Ready"],
//     acceptedAt: { $lt: new Date(get10min()) },
//   })
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja",
//     })
//     .populate({ path: "customer", select: "name phone" })
//     .populate({ path: "deliveryPartner", select: "name phone" })
//     .populate({ path: "orderItems", select: "menuItemTitle" })

//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { createdAt: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Order.count({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//     deliveryStatus: "Searching",
//     status: ["Preparing", "Ready"],
//     acceptedAt: { $lt: new Date(get10min()) },
//   });
//   res
//     .status(200)
//     .json({ data: order, total, status: "success", message: "successfully" });
// });

exports.getNearByDeliveryForOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await Order.findById(orderId)
    .populate("customer")
    .populate("restaurant");

  const data = await DeliveryPartnerCurrentLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: order.restaurant.location.coordinates,
        },
        maxDistance: 1200000 * 1000,
        spherical: true,
        distanceField: "distance",
        distanceMultiplier: 0.000621371,
      },
    },

    {
      $match: {
        available: true,
        locationUpdatedAt: { $gt: new Date(get1min()) },
      },
    },
    {
      $limit: 10,
    },
  ]);

  await DeliveryPartner.populate(data, {
    path: "deliveryPartner",
    // populate: "customizationItems",
    select: "name phone",
  });
  res.status(200).json({ status: "success", message: "Successfully", data });
});

exports.assignOrder = catchAsync(async (req, res, next) => {
  const { orderId, deliveryPartnerCurrentLocationId } = req.query;
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      deliveryPartnerCurrentLocationId
    ).populate("deliveryPartner");
  const order = await Order.findById(orderId)
    .populate("restaurant")
    .populate("customerAddress");

  if (!(order.deliveryStatus === "Searching")) {
    return next(new AppError("Order has delivery Partner", 404));
  }

  const data = await DeliveryPartnerOrderData.findOne({
    deliveryPartner: deliveryPartnerCurrentLocation.deliveryPartner,
    alarmTimeEndAt: { $gt: new Date(get4sec()) },
    accepted: false,
    rejected: false,
  });
  console.log(`data:${data}`);
  const data2 = await DeliveryPartnerOrderData.findOne({
    orderData: order._id,
    alarmTimeEndAt: { $gt: new Date() },
    accepted: false,
    rejected: false,
  });
  console.log(`data2:${data2}`);

  if (data2) {
    return next(
      new AppError("Order notification has sended to delivery Partner", 404)
    );
  }
  if (
    deliveryPartnerCurrentLocation.locationUpdatedAt > get1min() &&
    deliveryPartnerCurrentLocation.available &&
    !deliveryPartnerCurrentLocation.currentOrder &&
    !data
  ) {
    order.manualOrderAssign = true;
    await order.save();
    deliveryPartnerCurrentLocation.available = false;
    await deliveryPartnerCurrentLocation.save();

    console.log(
      `Manual order assignment for order id ${order.orderId} is set to true.`
    );
    console.log(`Delivery Partner's availability is set to false.`);

    let deliveryPartnerOrderData = null;
    request(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${deliveryPartnerCurrentLocation.location.coordinates[0]}%2C${deliveryPartnerCurrentLocation.location.coordinates[1]}%3B${order.restaurant.location.coordinates[0]}%2C${order.restaurant.location.coordinates[1]}?alternatives=true&annotations=duration%2Cdistance&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.ACCESS_TOKEN_MAPBOX}`,
      async function (error, response, body) {
        const data = JSON.parse(body);
        if (!error) {
          deliveryPartnerOrderData = await DeliveryPartnerOrderData.create({
            alarm: true,

            orderData: order._id,
            deliveryPartner: deliveryPartnerCurrentLocation.deliveryPartner._id,
            alarmTimeEndAt: new Date(get2min()),

            distance: data.routes[0].distance,
            duration: data.routes[0].duration,

            restaurant: {
              lat: order.restaurant.location.coordinates[1],
              lng: order.restaurant.location.coordinates[0],
            },
            customer: {
              lat: order.customerAddress.location.coordinates[1],
              lng: order.customerAddress.location.coordinates[0],
            },
            // searchId: searchDeliveryPartner._id,
            earning: order.deliveryCharge,
          });
          res.status(200).json({
            status: "success",
            message: "Delivery Partner assigning data created successfully",
            data: deliveryPartnerOrderData,
          });
          console.log(
            `Order id ${order.orderId} is reserved for ${deliveryPartnerCurrentLocation.deliveryPartner.name}.`
          );
        }
      }
    );
  } else {
    res.status(200).json({
      status: "busy",
      message: "Delivery Partner is busy now, try again partner",
    });
  }
});

exports.checkAssignStatus = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const data = await DeliveryPartnerOrderData.findById(id);
  if (data.accepted) {
    res.status(200).json({
      status: "success",
      message: "Delivery Partner assigned successfully",
    });
  } else if (data.rejected) {
    res.status(200).json({
      status: "rejected",
      message: "Delivery Partner rejected order",
    });
  } else {
    res.status(200).json({
      status: "not responded ",
      message: "Delivery Partner not responded on order",
    });
  }
});

exports.acceptOrder = catchAsync(async (req, res, next) => {
  const { preparationTime, orderId } = req.body;

  console.log("Received acceptOrder request for orderId:", orderId);

  const order = await Order.findById(orderId)
    .populate("customer")
    .populate("restaurant");
  if (!order) {
    return next(new AppError("No order found", 404));
  }
  if (!(order.status === "Pending")) {
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
        $maxDistance: 50 * 1000,
        $geometry: {
          type: "Point",
          coordinates: order.restaurant.location.coordinates,
        },
      },
    },
    available: true,
    locationUpdatedAt: { $gt: new Date(get1min()) },
  }).limit(10);
  console.log("findNearestDeliveryPartner", findNearestDeliveryPartner.length);
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
  console.log("Request payload:", req.body);
  const { orderId, rejectionReject } = req.body;

  const order = await Order.findById(orderId).populate("customer");
  if (!order) {
    return next(new AppError("No order found", 404));
  }
  if (!(order.status === "Pending")) {
    return next(new AppError("The order already  Handled ", 404));
  }

  order.rejectAt = new Date();

  order.status = "Reject";
  console.log(`Before : ${rejectionReject}`);

  order.rejectionReject = rejectionReject;
  console.log(`After : ${order.rejectionReject}`);

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
  if (!(order.status === "Preparing")) {
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
exports.markedPaymentCompleted = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;

 const order = await Order.findById(orderId);
 const paymentCompletedDate = new Date();
    const paymentHistoryModel = await PaymentHistoryModel.create({
      OrderId: order._id, 
      paymentCompleted: true,
      paymentCompletedDate
    });

    await paymentHistoryModel.save();

    order.paymentCompleted = true;
        order.paymentCompletedDate = paymentCompletedDate;

    await order.save();

    res.status(200).json({
      data:paymentHistoryModel,
      status: "success",
      message: "Successfully marked as Payment Completed",
    });
  
});
