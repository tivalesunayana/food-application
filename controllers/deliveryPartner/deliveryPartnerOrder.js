const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order/orderModel");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const { sendNotification } = require("../../config/firebase");
const { uploadImg } = require("../../config/s3config");
const AppError = require("../../utils/appError");
const axios = require("axios");
const DeliveryPartnerOrderData = require("../../models/deliveryPartner/deliveryPartnerOrderData");
// const pdfMake = require("pdfmake/build/pdfmake");
// const pdfFonts = require("pdfmake/build/vfs_fonts");
const Payment = require("../../models/payment/paymentModel");
const DeliveryPartnerCashLog = require("../../models/deliveryPartner/deliveryPartnerCashLogModel");
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// const pdfMake = require("pdfmake");

exports.currentOrder = catchAsync(async (req, res, next) => {
  console.log(
    `currentOrder:${req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder}`
  );
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  )
    .populate({ path: "customerAddress" })
    .populate({ path: "restaurant" })
    .populate({ path: "orderItems" })
    // .populate({ path: "restaurantAddress" })
    .populate({ path: "customer" });
  if (order) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: order });
  } else {
    res
      .status(201)
      .json({ status: "success", message: "successfully", data: null });
  }
});

exports.locationAndWaitingOrder = catchAsync(async (req, res, next) => {
  const { longitude, latitude } = req.body;
  if (!(req.deliveryPartner.status === "active")) {
    return next(new AppError("You are not active", 404));
  }

  if (req.deliveryPartner.deliveryPartnerCurrentLocation) {
    const deliveryPartnerCurrentLocation =
      await DeliveryPartnerCurrentLocation.findById(
        req.deliveryPartner.deliveryPartnerCurrentLocation._id
      );
    if (longitude && latitude) {
      deliveryPartnerCurrentLocation.location.coordinates = [
        longitude,
        latitude,
      ];
    }
    deliveryPartnerCurrentLocation.updateCount =
      deliveryPartnerCurrentLocation.updateCount + 1;
    deliveryPartnerCurrentLocation.online = true;
    deliveryPartnerCurrentLocation.locationUpdatedAt = new Date();
    await deliveryPartnerCurrentLocation.save();
  } else {
    const deliveryPartnerCurrentLocation =
      await DeliveryPartnerCurrentLocation.create({
        location: {
          type: "Point",
          coordinates: [
            longitude ? longitude : 72.9719009,
            latitude ? latitude : 19.1917138,
          ],
        },
        deliveryPartner: req.deliveryPartner._id,
        locationUpdatedAt: new Date(),
      });
    req.deliveryPartner.deliveryPartnerCurrentLocation =
      deliveryPartnerCurrentLocation._id;
    await req.deliveryPartner.save();
  }
  console.log(
    `Location ${longitude} ${latitude} of ${req.deliveryPartner.name}`
  );
  // check active order
  const data = await DeliveryPartnerOrderData.findOne({
    deliveryPartner: req.deliveryPartner._id,
    alarmTimeEndAt: { $gt: new Date() },
    accepted: false,
    rejected: false,
  });

  console.log("DeliveryPartner _id:", req.deliveryPartner._id);

  if (
    data &&
    !req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  ) {
    if (data.send) {
      const alarmSecond =
        (new Date(data.alarmTimeEndAt).getTime() - new Date().getTime()) / 1000;
      res.status(201).json({
        status: "success",
        message: "order already send",
        data,
        alarmSecond,
      });
    } else {
      const alarmSecond =
        (new Date(data.alarmTimeEndAt).getTime() - new Date().getTime()) / 1000;
      data.send = true;
      await data.save();

      res.status(200).json({
        data,
        alarmSecond,
        status: "success",
        message: "you have an order",
      });
    }
  } else {
    res.status(404).json({ status: "not found", message: "no order found" });
  }
});
// exports.locationAndWaitingOrder = catchAsync(async (req, res, next) => {
//   const { longitude, latitude } = req.body;

//   try {
//     if (!(req.deliveryPartner.status === "active")) {
//       return next(new AppError("You are not active", 404));
//     }

//     if (req.deliveryPartner.deliveryPartnerCurrentLocation) {
//       const deliveryPartnerCurrentLocation =
//         await DeliveryPartnerCurrentLocation.findById(
//           req.deliveryPartner.deliveryPartnerCurrentLocation._id
//         );

//       if (longitude && latitude) {
//         deliveryPartnerCurrentLocation.location.coordinates = [
//           longitude,
//           latitude,
//         ];
//       }

//       deliveryPartnerCurrentLocation.updateCount++;
//       deliveryPartnerCurrentLocation.online = true;
//       deliveryPartnerCurrentLocation.locationUpdatedAt = new Date();
//       await deliveryPartnerCurrentLocation.save();
//     } else {
//       const deliveryPartnerCurrentLocation =
//         await DeliveryPartnerCurrentLocation.create({
//           location: {
//             type: "Point",
//             coordinates: [
//               longitude ? longitude : 72.9719009,
//               latitude ? latitude : 19.1917138,
//             ],
//           },
//           deliveryPartner: req.deliveryPartner._id,
//           locationUpdatedAt: new Date(),
//         });

//       req.deliveryPartner.deliveryPartnerCurrentLocation =
//         deliveryPartnerCurrentLocation._id;
//       await req.deliveryPartner.save();
//     }

//     console.log(
//       `Location ${longitude} ${latitude} of ${req.deliveryPartner.name}`
//     );
//     const order = await Order.findOne({ orderId: req.body.orderId });

//     // Check active order
//     const data = await DeliveryPartnerOrderData.findOne({
//       deliveryPartner: req.deliveryPartner._id,
//       orderData: order._id,
//       alarmTimeEndAt: { $gt: new Date() },
//       accepted: false,
//       rejected: false,
//     });
//     console.log("Current Date:", new Date());
//     console.log("DeliveryPartner _id:", req.deliveryPartner._id);
//     console.log("Current Date:", new Date());

//     if (data) {
//       console.log(
//         `Found order for deliveryPartner: ${req.deliveryPartner._id}`
//       );
//       if (!req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder) {
//         if (data.send) {
//           const alarmSecond =
//             (new Date(data.alarmTimeEndAt).getTime() - new Date().getTime()) /
//             1000;
//           res.status(201).json({
//             status: "success",
//             message: "order already sent",
//             data,
//             alarmSecond,
//           });
//         } else {
//           const alarmSecond =
//             (new Date(data.alarmTimeEndAt).getTime() - new Date().getTime()) /
//             1000;
//           data.send = true;
//           await data.save();
//           res.status(200).json({
//             data,
//             alarmSecond,
//             status: "success",
//             message: "you have an order",
//           });
//         }
//       }
//     } else {
//       console.log(
//         "No order found for deliveryPartner:",
//         req.deliveryPartner._id
//       );
//       res.status(404).json({ status: "not found", message: "no order found" });
//     }
//   } catch (error) {
//     console.error("Error in locationAndWaitingOrder:", error);
//     next(new AppError("An error occurred", 500));
//   }
// });

exports.callCustomer = catchAsync(async (req, res, next) => {
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  ).populate("customer");

  const data = await axios.post(
    `https://api-smartflo.tatateleservices.com/v1/click_to_call`,
    {
      agent_number: req.deliveryPartner.phone,
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

exports.callRestaurant = catchAsync(async (req, res, next) => {
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  ).populate("restaurant");

  const data = await axios.post(
    `https://api-smartflo.tatateleservices.com/v1/click_to_call`,
    {
      agent_number: req.deliveryPartner.phone,
      destination_number: order.restaurant.merchant_number,
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

exports.reachedRestaurantDeliveryUpdate = catchAsync(async (req, res, next) => {
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  )
    .populate("customer")
    .populate("restaurant");
  order.deliveryStatus = "ReachedRestaurant";
  order.reachedRestaurantAt = new Date();
  await order.save();
  sendNotification(
    `${req.deliveryPartner.name} has reached Restaurant`,
    // "body",
    "Tap to Open",

    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  if (order.restaurant.petpooja === false) {
    await axios.post(process.env.RIDERSTATUSURL, {
      app_key: process.env.PETPOOJA_APP_KEY,
      app_secret: process.env.PETPOOJA_APP_SECRET,
      access_token: process.env.PETPOOJA_ACCESS_TOKEN,
      order_id: order.orderId.toString(),
      outlet_id: order.restaurant.menusharingcode,
      // outlet_id: order.restaurant.restaurantid,
      status: "rider-arrived",
      rider_data: {
        rider_name: req.deliveryPartner.name,
        rider_phone_number: req.deliveryPartner.phone.split("+91")[1],
      },
      external_order_id: "", // pass this blank
    });
  }
  if (order) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: order });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: null });
  }
});

exports.reachedCustomerDeliveryUpdate = catchAsync(async (req, res, next) => {
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  ).populate("customer");
  order.deliveryStatus = "ReachedCustomer";
  sendNotification(
    `${req.deliveryPartner.name} has reached at your delivery location`,
    // "body",
    "Tap to Open",

    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  order.reachedCustomerAt = new Date();

  await order.save();
  if (order) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: order });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: null });
  }
});

exports.pickedUpDeliveryUpdate = catchAsync(async (req, res, next) => {
  const file = req.file;
  const response = await uploadImg(file);
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  )
    .populate("customer")
    .populate("restaurant");
  order.pickUpImage = response.Key;
  order.deliveryStatus = "Picked-up";
  order.status = "Picked-up";
  order.pickedUpAt = new Date();

  await order.save();
  sendNotification(
    `${req.deliveryPartner.name} has picked up your order`,
    // "body",
    "Tap to Open",

    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  if (order.restaurant.petpooja === false) {
    await axios.post(process.env.RIDERSTATUSURL, {
      app_key: process.env.PETPOOJA_APP_KEY,
      app_secret: process.env.PETPOOJA_APP_SECRET,
      access_token: process.env.PETPOOJA_ACCESS_TOKEN,
      order_id: order.orderId.toString(),
      outlet_id: order.restaurant.outlet_id,
      // outlet_id: orderData.restaurant.restaurantid,
      status: "pickedup",
      rider_data: {
        rider_name: req.deliveryPartner.name,
        rider_phone_number: req.deliveryPartner.phone.split("+91")[1],
      },
      external_order_id: "", // pass this blank
    });
  }
  if (order) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: order });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: null });
  }
});

// exports.deliveredDeliveryUpdate = catchAsync(async (req, res, next) => {
//   const otp = req.body.otp * 1;
//   const order = await Order.findById(
//     req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
//   )
//     .populate("customer")
//     .populate("restaurant");

//   if (!(otp === order.otp)) {
//     return next(new AppError("otp is wrong", 404));
//   }
//   order.deliveryStatus = "Delivered";
//   order.status = "Delivered";
//   const deliveryPartnerCurrentLocation =
//     await DeliveryPartnerCurrentLocation.findById(
//       req.deliveryPartner.deliveryPartnerCurrentLocation._id
//     );
//   deliveryPartnerCurrentLocation.available = true;
//   deliveryPartnerCurrentLocation.currentOrder = undefined;
//   if (order.paymentMode === "COD") {
//     deliveryPartnerCurrentLocation.cashAmount =
//       deliveryPartnerCurrentLocation.cashAmount + order.paymentAmount;
//   }
//   sendNotification(
//     `${req.deliveryPartner.name} has delivered your order`,
//     // "body",
//     "Tap To Open",

//     order.customer.notificationToken,
//     { orderUpdate: order._id.toString() }
//   );
//   await deliveryPartnerCurrentLocation.save();
//   order.deliveredAt = new Date();
//   if (order.restaurant.petpooja === false) {
//     await axios.post(process.env.RIDERSTATUSURL, {
//       app_key: process.env.PETPOOJA_APP_KEY,
//       app_secret: process.env.PETPOOJA_APP_SECRET,
//       access_token: process.env.PETPOOJA_ACCESS_TOKEN,
//       order_id: order.orderId.toString(),
//       outlet_id: order.restaurant.outlet_id,
//       // outlet_id: orderData.restaurant.restaurantid,
//       status: "delivered",
//       rider_data: {
//         rider_name: req.deliveryPartner.name,
//         rider_phone_number: req.deliveryPartner.phone.split("+91")[1],
//       },
//       external_order_id: "", // pass this blank
//     });
//   }
//   await order.save();
//   if (order) {
//     res
//       .status(200)
//       .json({ status: "success", message: "successfully", data: order });
//   } else {
//     res
//       .status(200)
//       .json({ status: "success", message: "successfully", data: null });
//   }
// });
exports.deliveredDeliveryUpdate = catchAsync(async (req, res, next) => {
  const otp = req.body.otp * 1;
  const order = await Order.findById(
    req.deliveryPartner.deliveryPartnerCurrentLocation.currentOrder
  )
    .populate("customer")
    .populate("restaurant");
  console.log("OTP check", order);
  if (!(otp === order.otp)) {
    console.log("galt h otp");
    return next(new AppError("otp is wrong", 404));
  }
  console.log("sahi h h otp");
  order.deliveryStatus = "Delivered";
  order.status = "Delivered";
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      req.deliveryPartner.deliveryPartnerCurrentLocation._id
    );
  deliveryPartnerCurrentLocation.available = true;
  deliveryPartnerCurrentLocation.currentOrder = undefined;
  if (order.paymentMode === "COD") {
    deliveryPartnerCurrentLocation.cashAmount =
      deliveryPartnerCurrentLocation.cashAmount + order.paymentAmount;
  }
  sendNotification(
    `${req.deliveryPartner.name} has delivered your order`,
    "Tap to Open",
    order.customer.notificationToken,
    { orderUpdate: order._id.toString() }
  );
  await deliveryPartnerCurrentLocation.save();
  order.deliveredAt = new Date();
  if (order.restaurant.petpooja === false) {
    await axios.post(process.env.RIDERSTATUSURL, {
      app_key: process.env.PETPOOJA_APP_KEY,
      app_secret: process.env.PETPOOJA_APP_SECRET,
      access_token: process.env.PETPOOJA_ACCESS_TOKEN,
      order_id: order.orderId.toString(),
      outlet_id: order.restaurant.outlet_id,
      // outlet_id: orderData.restaurant.restaurantid,
      status: "delivered",
      rider_data: {
        rider_name: req.deliveryPartner.name,
        rider_phone_number: req.deliveryPartner.phone.split("+91")[1],
      },
      external_order_id: "", // pass this blank
    });
  }

  await order.save();

  // calculate all reports of the orders

  const orderData = await Order.findById(order._id);
  const couponType = await Coupon.findById(order.coupon);
  console.log("couponType", couponType);
  console.log("Order saved To calculate Report data ....", orderData);
  const resta = await Restaurant.findById(orderData.restaurant);
  if (orderData.deliveryStatus === "Delivered") {
    function financial(x) {
      return Number.parseFloat(x).toFixed(2);
    }
    let bankId = resta.bankDetail;
    let petpooja = resta.petPooja;
    let tdsOnAmountPayable = 0;
    let YbitesCommission = 0;
    let restaurantAfterDiscountPrice = 0;
    let gstOnMenuCustomer = 0;
    let ybitesAfterDiscountPrice = 0;
    let totalAmountPayable = 0;
    let ybitesCollection = 0;
    let gstOnCommissionRestaurant = 0;
    if (petpooja === true) {
      YbitesCommission = (order.totalPrice * 8) / 100;
    } else {
      YbitesCommission = (order.totalPrice * 15) / 100;
    }

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
        console.log("totalAmountPayable restaurant", totalAmountPayable);
        console.log(
          "restaurantAfterDiscountPrice",
          restaurantAfterDiscountPrice
        );
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

    // let totalAmountPayable =
    //   order.totalPrice - YbitesCommission - gstOnCommissionRestaurant;

    if (
      order.restaurant.pan_no.charAt(3) === "F" ||
      order.restaurant.pan_no.charAt(3) === "C"
    ) {
      tdsOnAmountPayable = Number(totalAmountPayable * 2) / 100;
    } else {
      tdsOnAmountPayable = Number(totalAmountPayable * 1) / 100;
    }
    // let gstOnMenuCustomer = (order.grandTotalPrice * 5) / 100;
    let netPayableAmount = totalAmountPayable - tdsOnAmountPayable;
    let gstOnDelivery = (orderData.deliveryCharge / 118) * 18;
    let gstOnPackingCharge = (orderData.packagingCharge / 118) * 18;
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
          orderData.deliveryCharge +
          orderData.packagingCharge +
          gstOnMenuCustomer;
        console.log("ybitesCollection restaurant", ybitesCollection);
        console.log("gstOnMenuCustomer restaurant", gstOnMenuCustomer);
      } else if (couponType.couponType === "admin") {
        ybitesCollection =
          actualAmountCollectedOnMenu +
          orderData.deliveryCharge +
          orderData.packagingCharge +
          gstOnMenuCustomer;
        console.log("ybitesCollection  admin", ybitesCollection);
        console.log("gstOnMenuCustomer  admin", gstOnMenuCustomer);
      }
    } else {
      ybitesCollection =
        actualAmountCollectedOnMenu +
        orderData.deliveryCharge +
        orderData.packagingCharge +
        gstOnMenuCustomer;
      console.log("ybitesCollection  ", ybitesCollection);
      console.log("gstOnMenuCustomer  ", gstOnMenuCustomer);
    }
    let deduction = 0;
    let profit = 0;

    deduction =
      totalGst + totalTds + orderData.deliveryBoyShare + netPayableAmount;
    profit = ybitesCollection - deduction;

    console.log("Restaurant found", resta);
    // console.log("bankId", bankId);
    console.log("deduction  ", deduction);
    console.log("profit  ", profit);

    const createdReports = await OrderReports.create({
      deliveredOrderId: order._id,
      couponType: couponType ? couponType._id : null,
      restaurantAfterDiscountPrice: restaurantAfterDiscountPrice,
      ybitesAfterDiscountPrice: ybitesAfterDiscountPrice,
      actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
      restaurantId: orderData.restaurant,
      deliveryPartnerId: orderData.deliveryPartner,
      customerId: orderData.customer,
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

  // ---------------------

  if (order) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: order });
  } else {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: null });
  }
});
exports.acceptOrder = catchAsync(async (req, res, next) => {
  const { dataId, accept } = req.body;
  const data = await DeliveryPartnerOrderData.findById(dataId);
  const order = await Order.findById(data.orderData);

  if (order.deliveryPartner) {
    return next(new AppError("You missed order", 404));
  }

  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      req.deliveryPartner.deliveryPartnerCurrentLocation._id
    );
  if (!(data.alarmTimeEndAt > new Date())) {
    return next(new AppError("You missed order", 404));
  }

  if (accept) {
    if (data.accepted) {
      const orderData = await Order.findById(order._id)
        .populate({ path: "customerAddress" })
        .populate({ path: "restaurant" })
        .populate({ path: "orderItems" })
        .populate({ path: "customer" });
      res.status(200).json({
        status: "success",
        message: "Order accepted",
        data: orderData,
      });
    }
    console.log(
      `Order id ${order.orderId} accepted By ${req.deliveryPartner.name}`
    );
    data.accepted = true;
    order.deliveryPartner = req.deliveryPartner._id;
    order.deliveryStatus = "Accepted";
    order.duration = data.duration;
    order.distance = data.distance;
    deliveryPartnerCurrentLocation.currentOrder = order._id;
    deliveryPartnerCurrentLocation.available = false;
    await deliveryPartnerCurrentLocation.save();
    await data.save();
    await order.save();
    const orderData = await Order.findById(order._id)
      .populate({ path: "customerAddress" })
      .populate({ path: "restaurant" })
      .populate({ path: "orderItems" })
      .populate({ path: "customer" });
    if (order.restaurant.petpooja === false) {
      await axios.post(process.env.RIDERSTATUSURL, {
        app_key: process.env.PETPOOJA_APP_KEY,
        app_secret: process.env.PETPOOJA_APP_SECRET,
        access_token: process.env.PETPOOJA_ACCESS_TOKEN,
        order_id: orderData.orderId.toString(),
        outlet_id: order.restaurant.outlet_id,
        // outlet_id: orderData.restaurant.restaurantid,
        status: "rider-assigned",
        rider_data: {
          rider_name: req.deliveryPartner.name,
          rider_phone_number: req.deliveryPartner.phone.split("+91")[1],
        },
        external_order_id: "", // pass this blank
      });
    }
    res.status(200).json({
      status: "success",
      message: "Order accepted",
      data: orderData,
    });
  } else {
    data.rejected = true;
    await data.save();
    deliveryPartnerCurrentLocation.available = true;
    await deliveryPartnerCurrentLocation.save();
    res.status(200).json({ status: "success", message: "Order rejected" });
  }
});

// exports.getCashLog = catchAsync(async (req, res, next) => {
//   const { deliveryPartnerId } = req.params;

//   const orders = await Order.find({
//     deliveryPartner: deliveryPartnerId,
//   })
//     .populate("deliveryPartner")
//     .populate("payment");
//   const deliveryPartnerCurrentLocation =
//     await DeliveryPartnerCurrentLocation.find({
//       deliveryPartner: deliveryPartnerId,
//     });
//   const payments = await Payment.find({
//     deliveryPartner: deliveryPartnerId,
//   }).populate({
//     path: "order",
//     model: Order,
//     select: "deliveryPartner",
//   });
//   const cashLog = await DeliveryPartnerCashLog.find({
//     deliveryPartner: deliveryPartnerId,
//   });
//   console.log(`cashLog:${cashLog}`);

//   const documentDefinition = {
//     content: [
//       { text: "Delivery Partner Cash Log Report", style: "header" },
//       {
//         text: `Delivery Partner Name: ${
//           orders.length > 0 ? orders[0].deliveryPartner.name : "N/A"
//         }`,
//         style: "subheader",
//       },
//       { text: "Order Details", style: "subheader" },
//       {
//         style: "tableExample",
//         table: {
//           widths: ["*", "*", "*", "*", "*"],
//           body: [
//             [
//               "Sr.No.",
//               "Order ID",
//               "paymentMode",
//               "amount",
//               "customer Payment Amount",
//             ],
//             ...orders.map((order, index) => [
//               index + 1,
//               order.orderId,
//               order.payment.paymentMode,
//               order.payment.amount.toFixed(2),

//               order.paymentAmount.toFixed(2),
//             ]),
//           ],
//         },
//       },
//     ],
//     styles: {
//       header: {
//         fontSize: 18,
//         bold: true,
//         margin: [0, 0, 0, 10],
//       },
//       subheader: {
//         fontSize: 14,
//         bold: true,
//         margin: [0, 10, 0, 5],
//       },
//       tableExample: {
//         margin: [0, 5, 0, 15],
//       },
//       tableHeader: {
//         bold: true,
//         fontSize: 13,
//         color: "black",
//         alignment: "center",
//       },
//     },
//   };

//   // Generate the PDF
//   const pdfDoc = pdfMake.createPdf(documentDefinition);

//   pdfDoc.getBuffer((buffer) => {
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=delivery_partner_cash_log_report.pdf"
//     );
//     res.end(buffer);
//   });
// });
// exports.getCashLogRemaining = catchAsync(async (req, res, next) => {
//   const { deliveryPartnerId } = req.params;

//   const orders = await Order.find({
//     deliveryPartner: deliveryPartnerId,
//   })
//     .populate("deliveryPartner")
//     .populate("payment");
//   const deliveryPartnerCurrentLocation =
//     await DeliveryPartnerCurrentLocation.find({
//       deliveryPartner: deliveryPartnerId,
//     });
//   const payments = await Payment.find({
//     deliveryPartner: deliveryPartnerId,
//   }).populate({
//     path: "order",
//     model: Order,
//     select: "deliveryPartner",
//   });
//   const cashLog = await DeliveryPartnerCashLog.find({
//     deliveryPartner: deliveryPartnerId,
//   });

//   const documentDefinition = {
//     content: [
//       { text: "Delivery Partner Cash Log Report", style: "header" },
//       {
//         text: `Delivery Partner Name: ${
//           orders.length > 0 ? orders[0].deliveryPartner.name : "N/A"
//         }`,
//         style: "subheader",
//       },

//       {
//         style: "tableExample",
//         color: "#444",
//         table: {
//           widths: ["auto", "auto", "auto", "auto"],
//           headerRows: 2,
//           body: [
//             [
//               {
//                 text: "Amount Settled",
//                 style: "tableHeader",
//                 colSpan: 3,
//                 alignment: "center",
//               },
//               {},
//               {},
//               {},
//             ],
//             ["Sr No", "Amount Submitted", "Date", "Cash Amount"],
//             ...cashLog.map((log, index) => [
//               index + 1,
//               log.amountSubmitted,
//               new Date(log.date).toLocaleString(),
//               deliveryPartnerCurrentLocation.length > index
//                 ? deliveryPartnerCurrentLocation[index].cashAmount
//                 : "N/A",
//             ]),
//           ],
//         },
//       },
//     ],
//     styles: {
//       header: {
//         fontSize: 18,
//         bold: true,
//         margin: [0, 0, 0, 10],
//       },
//       subheader: {
//         fontSize: 14,
//         bold: true,
//         margin: [0, 10, 0, 5],
//       },
//       tableExample: {
//         margin: [0, 5, 0, 15],
//       },
//       tableHeader: {
//         bold: true,
//         fontSize: 13,
//         color: "black",
//         alignment: "center",
//       },
//     },
//   };

//   // Generate the PDF
//   const pdfDoc = pdfMake.createPdf(documentDefinition);

//   // Send the PDF as a download to the client
//   pdfDoc.getBuffer((buffer) => {
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=delivery_partner_cash_log_report.pdf"
//     );
//     res.end(buffer);
//   });
// });
