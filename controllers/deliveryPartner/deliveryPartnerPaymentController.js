const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order/orderModel");
const mongoose = require("mongoose");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");

exports.deliveryPartnerPayment = catchAsync(async (req, res, next) => {
  const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
  const endDate = new Date();
  const startDate = new Date(
    new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    // .setMilliseconds(+(330 * 60 * 1000))
  );

  const order = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
        deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
      },
    },
    {
      $addFields: {
        createdAt: {
          $dateFromParts: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
        dateRange: {
          $map: {
            input: {
              $range: [
                0,
                { $subtract: [endDate, startDate] },
                1000 * 60 * 60 * 24,
              ],
            },
            in: { $add: [startDate, "$$this"] },
          },
        },
      },
    },
    { $unwind: "$dateRange" },
    {
      $group: {
        _id: "$dateRange",

        order: {
          $push: {
            $cond: [
              { $eq: ["$dateRange", "$createdAt"] },
              {
                deliveryShare: "$deliveryShare",
                orderId: "$orderId",
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },
    { $sort: { _id: -1 } },
    { $addFields: { total: { $sum: "$order.deliveryShare" } } },
    // { $addFields: { date: { $sum: "$_id" } } },
    {
      $project: {
        date: "$_id",
        order: "$order",
        total: "$total",
      },
    },
  ]);
  res.status(200).json({ data: order });
});

// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
//   const endDate = new Date();
//   const startDate = new Date(
//     new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
//   );

//   const orders = await Order.aggregate([
//     {
//       $match: {
//         createdAt: { $gte: startDate, $lt: endDate },
//         deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
//       },
//     },
//     {
//       $addFields: {
//         createdAt: {
//           $dateFromParts: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: "$createdAt",
//           // formattedDate: {
//           //   $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           // },
//         },
//         order: {
//           $push: {
//             orderId: "$orderId",
//             deliveryCharge: "$deliveryCharge",
//             deliveryCharges: "0",
//           },
//         },
//         numberOfOrdersCompleted: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { "_id.date": -1 },
//     },
//     {
//       $project: {
//         // date: "$_id",
//         order: "$order",
//         total: {
//           $sum: [
//             500, // Daily Salary
//             {
//               $cond: [
//                 { $gte: ["$numberOfOrdersCompleted", 5] }, // Check if orders > 5
//                 40, // Delivery Charge
//                 0,
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ]);

//   res.status(200).json({ data: orders });
// });
// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
//   const endDate = new Date();
//   const startDate = new Date(
//     new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
//   );

//   const orders = await Order.aggregate([
//     {
//       $match: {
//         createdAt: { $gte: startDate, $lt: endDate },
//         deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
//       },
//     },
//     {
//       $addFields: {
//         createdAt: {
//           $dateFromParts: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: "$createdAt",
//           // formattedDate: {
//           //   $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           // },
//         },
//         order: {
//           $push: {
//             orderId: "$orderId",
//             deliveryCharge: "$deliveryCharge",
//           },
//         },
//         numberOfOrdersCompleted: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { "_id.date": -1 },
//     },
//     {
//       $project: {
//         // date: "$_id",
//         order: "$order",
//         total: {
//           $sum: [
//             500, // Daily Salary
//             {
//               $cond: [
//                 { $gte: ["$numberOfOrdersCompleted", 5] }, // Check if orders > 5
//                 {
//                   $sum: {
//                     $cond: [
//                       { $gt: ["$numberOfOrdersCompleted", 5] }, // Check if orders > 5
//                       "$order.deliveryCharge", // Add up the delivery charges
//                       0,
//                     ],
//                   },
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ]);

//   res.status(200).json({ data: orders });
// });
// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
//   const endDate = new Date();
//   const startDate = new Date(
//     new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
//   );

//   const orders = await Order.aggregate([
//     {
//       $match: {
//         createdAt: { $gte: startDate, $lt: endDate },
//         deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
//       },
//     },
//     {
//       $addFields: {
//         createdAt: {
//           $dateFromParts: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: "$createdAt",
//         },
//         order: {
//           $push: {
//             orderId: "$orderId",
//             deliveryCharge: "$deliveryCharge",
//           },
//         },
//         numberOfOrdersCompleted: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { "_id.date": -1 },
//     },
//     {
//       $project: {
//         order: "$order",
//         total: {
//           $sum: [
//             500, // Daily Salary
//             {
//               $cond: [
//                 { $gte: ["$numberOfOrdersCompleted", 6] }, // Check if orders > 5
//                 {
//                   $reduce: {
//                     input: "$order",
//                     initialValue: 0,
//                     in: {
//                       $cond: [
//                         { $gte: ["$$this.orderId", 6] }, // Check if it's the 6th order or later
//                         { $add: ["$$value", "$$this.deliveryCharge"] },
//                         "$$value",
//                       ],
//                     },
//                   },
//                 },
//                 0,
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ]);

//   res.status(200).json({ data: orders });
// });
// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
//   const endDate = new Date();
//   const startDate = new Date(
//     new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
//   );

//   const orders = await Order.aggregate([
//     {
//       $match: {
//         createdAt: { $gte: startDate, $lt: endDate },
//         deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
//       },
//     },
//     {
//       $addFields: {
//         createdAt: {
//           $dateFromParts: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: "$createdAt",
//         },
//         order: {
//           $push: {
//             orderId: "$orderId",
//             deliveryCharge: "$deliveryCharge",
//           },
//         },
//         numberOfOrdersCompleted: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { "_id.date": -1 },
//     },
//     {
//       $project: {
//         order: "$order",
//         total: {
//           $sum: [
//             500, // Daily Salary
//             {
//               $cond: [
//                 { $gte: ["$numberOfOrdersCompleted", 5] }, // Check if orders >= 6
//                 {
//                   $reduce: {
//                     input: "$order",
//                     initialValue: 0,
//                     in: {
//                       $cond: [
//                         { $gte: ["$$this.orderId", 6] }, // Check if it's the 6th order or later
//                         { $add: ["$$value", "$$this.deliveryCharge"] }, // Add delivery charge
//                         "$$value", // Keep the value the same
//                       ],
//                     },
//                   },
//                 },
//                 0, // Total remains 0 if orders < 6
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ]);

//   res.status(200).json({ data: orders });
// });

// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   try {
//     const deliveryPartnerId = req.deliveryPartner._id;
//     const orders = await Order.find({
//       deliveryPartner: deliveryPartnerId,
//     }).sort({ createdAt: 1 });

//     const result = [];
//     let totalEarnings = 0;
//     let dailyEarnings = 0;
//     let currentDate = null;
//     let ordersForCurrentDate = [];

//     orders.forEach((order, index) => {
//       const { orderId, deliveryCharge, createdAt } = order;
//       const formattedOrder = {
//         orderId: orderId,
//         deliveryCharge: index >= 5 ? deliveryCharge : 0,
//       };

//       // Check if the order's date is different from the current date
//       if (!currentDate || currentDate !== createdAt.toDateString()) {
//         if (currentDate) {
//           result.push({
//             date: currentDate,
//             orders: ordersForCurrentDate,
//             dailyEarnings: dailyEarnings,
//           });
//           ordersForCurrentDate = [];
//           dailyEarnings = 0;
//         }
//         currentDate = createdAt.toDateString();
//       }

//       dailyEarnings += 500 + formattedOrder.deliveryCharge;
//       ordersForCurrentDate.push(formattedOrder);
//       totalEarnings += formattedOrder.deliveryCharge;
//     });

//     // Add the last day's data
//     if (currentDate) {
//       result.push({
//         date: currentDate,
//         orders: ordersForCurrentDate,
//         dailyEarnings: dailyEarnings,
//       });
//     }

//     res.json({ data: result, total: totalEarnings });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
//   try {
//     const deliveryPartnerId = req.deliveryPartner._id;
//     const orders = await Order.find({
//       deliveryPartner: deliveryPartnerId,
//     }).sort({ createdAt: 1 });

//     const result = [];
//     let totalEarnings = 0;
//     let dailyEarnings = 500;
//     let currentDate = null;
//     let ordersForCurrentDate = [];

//     orders.forEach((order, index) => {
//       const { orderId, deliveryCharge, createdAt } = order;
//       const formattedOrder = {
//         orderId: orderId,
//         deliveryCharge: index >= 5 ? deliveryCharge : 0,
//       };

//       // Check if the order's date is different from the current date
//       if (!currentDate || currentDate !== createdAt.toDateString()) {
//         if (currentDate) {
//           result.push({
//             date: currentDate,
//             orders: ordersForCurrentDate,
//             dailyEarnings: dailyEarnings,
//           });
//           ordersForCurrentDate = [];
//           dailyEarnings = 500;
//         }
//         currentDate = createdAt.toDateString();
//       }

//       dailyEarnings += formattedOrder.deliveryCharge;
//       ordersForCurrentDate.push(formattedOrder);
//       totalEarnings += formattedOrder.deliveryCharge;
//     });

//     // Add the last day's data
//     if (currentDate) {
//       result.push({
//         date: currentDate,
//         orders: ordersForCurrentDate,
//         dailyEarnings: dailyEarnings,
//       });
//     }

//     res.json({ data: result, total: totalEarnings });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
exports.currentDeliveryPartnerPayment = catchAsync(async (req, res, next) => {
  try {
    const deliveryPartnerId = req.deliveryPartner._id;
    const orders = await Order.find({
      deliveryPartner: deliveryPartnerId,
    }).sort({ createdAt: -1 });

    const result = [];
    let totalEarnings = 0;
    let currentDate = null;
    let dailyEarnings = 500;
    let dailyOrders = [];
    let dailyOrderCount = 0;

    orders.forEach((order, index) => {
      const { orderId, deliveryCharge, createdAt } = order;

      // Check if the order's date is different from the current date
      if (!currentDate || currentDate !== createdAt.toDateString()) {
        if (currentDate) {
          result.push({
            date: currentDate,
            orders: dailyOrders,
            dailyEarnings: dailyEarnings,
          });
          dailyOrders = [];
          dailyEarnings = 500;
          dailyOrderCount = 0;
        }
        currentDate = createdAt.toDateString();
      }

      const formattedOrder = {
        orderId: orderId,
        deliveryCharge: dailyOrderCount >= 5 ? deliveryCharge : 0,
      };

      dailyEarnings += formattedOrder.deliveryCharge;
      dailyOrders.push(formattedOrder);
      totalEarnings += formattedOrder.deliveryCharge;
      dailyOrderCount++;
    });

    // Add the last day's data
    if (currentDate) {
      result.push({
        date: currentDate,
        orders: dailyOrders,
        dailyEarnings: dailyEarnings,
      });
    }

    res.json({ data: result, total: totalEarnings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.getCashDepositLog = catchAsync(async (req, res, next) => {
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      req.deliveryPartner.deliveryPartnerCurrentLocation._id
    ).populate("deliveryPartnerCashLog");

  const data = {
    cashLog: deliveryPartnerCurrentLocation.deliveryPartnerCashLog,
    cashAmount: deliveryPartnerCurrentLocation.cashAmount,
    cashLimit: deliveryPartnerCurrentLocation.cashLimit,
  };
  res.status(200).json({ status: "success", message: "Successfully", data });
});
