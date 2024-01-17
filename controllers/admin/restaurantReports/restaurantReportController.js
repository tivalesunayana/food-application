const appError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const Order = require("../../../models/order/orderModel");
const DeliveryPartnerCurrentLocation = require("../../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const DeliveryPartner = require("../../../models/deliveryPartner/deliveryPartner");
const DeliveryPartnerOrderData = require("../../../models/deliveryPartner/deliveryPartnerOrderData");
const request = require("postman-request");
const AppError = require("../../../utils/appError");
const { sendNotification } = require("../../../config/firebase");
const SearchDeliveryPartner = require("../../../models/order/searchDeliveryPartner");
const OrderReports = require("../../../models/order/orderReportModel");
const moment = require("moment/moment");

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

// exports.getCalculatedRestaurantReport = catchAsync(async (req, res, next) => {
//   try {
//     const { page, limit, sort, field ,paymentCompletedDate,paymentCompleted} = req.query;
//     const { startDate, endDate } = req.query;
//     console.log("startDate", startDate);
//     console.log(" endDate", endDate);
//     let getRestaurantReport = await OrderReports.find()
//       .populate({
//         path: "deliveredOrderId",
//         model: "Order",

//         populate: { path: "orderItems", select: "itemTitle price quantity" },
//       })

//       .populate({ path: "restaurantId", model: "Restaurant" })
//       .populate({ path: "bankDetails", model: "BankDetail" })
//       .populate({ path: "couponType", select: "code couponType" })
//       .sort(
//         field
//           ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//           : { _id: -1 }
//       );

//     if (startDate && endDate) {
//       let activeCustomers = [];
//       for (let index = 0; index < getRestaurantReport.length; index++) {
//         let updatedDate = getRestaurantReport[index].updatedAt;
//         let compareDate = moment().subtract({ days: 7 }).format("YYYY-MM-DD");

//         if (
//           moment(updatedDate).format("YYYY-MM-DD") >=
//             moment(startDate).format("YYYY-MM-DD") &&
//           moment(updatedDate).format("YYYY-MM-DD") <=
//             moment(endDate).format("YYYY-MM-DD")
//         ) {
//           activeCustomers.push(getRestaurantReport[index]);
//         }
//       }

//       getRestaurantReport = activeCustomers;

//       console.log(" startDate date h", startDate);
//       console.log(" endDate date h", endDate);
//       console.log("Date between startDate and endDate", activeCustomers.length);
//     }

//     res.status(200).json({
//       message: "All restaurant reports ",
//       status: "success",
//       data: getRestaurantReport,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
exports.getCalculatedRestaurantReport = catchAsync(async (req, res, next) => {
    try {
      const { page, limit, sort, field ,paymentCompletedDate,paymentCompleted} = req.query;
      const { startDate, endDate } = req.query;
     
      let getRestaurantReport = await OrderReports.find()
        .populate({
          path: "deliveredOrderId",
          model: "Order",
  
          populate: { path: "orderItems", select: "itemTitle price quantity" },
        })
  
        .populate({ path: "restaurantId", model: "Restaurant" })
        .populate({ path: "bankDetails", model: "BankDetail" })
        .populate({ path: "couponType", select: "code couponType" })
        .sort(
          field
            ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
            : { _id: -1 }
        );
  
      if (startDate && endDate) {
        let activeCustomers = [];
        for (let index = 0; index < getRestaurantReport.length; index++) {
          let updatedDate = getRestaurantReport[index].updatedAt;
          let compareDate = moment().subtract({ days: 7 }).format("YYYY-MM-DD");
  
          if (
            moment(updatedDate).format("YYYY-MM-DD") >=
              moment(startDate).format("YYYY-MM-DD") &&
            moment(updatedDate).format("YYYY-MM-DD") <=
              moment(endDate).format("YYYY-MM-DD")
          ) {
            activeCustomers.push(getRestaurantReport[index]);
          }
        }
  
        getRestaurantReport = activeCustomers;
  
        console.log(" startDate date h", startDate);
        console.log(" endDate date h", endDate);
        console.log("Date between startDate and endDate", activeCustomers.length);
      }
     
  
  if (paymentCompleted === 'true' || paymentCompleted === 'false') {
    getRestaurantReport = getRestaurantReport.filter((report) => {
      return report.deliveredOrderId.paymentCompleted === (paymentCompleted === 'true');
    });
  }
  if (paymentCompletedDate) {
    getRestaurantReport = getRestaurantReport.filter((report) => {
      if (report.deliveredOrderId.paymentCompletedDate) {
        const deliveredOrderDate = moment(report.deliveredOrderId.paymentCompletedDate).format('YYYY-MM-DD');
        return deliveredOrderDate === moment(paymentCompletedDate).format('YYYY-MM-DD');
      }
      return false; 
    });
  }
  
  
  
     
      res.status(200).json({
        message: "All restaurant reports ",
        status: "success",
        data: getRestaurantReport,
      });
    } catch (error) {
      console.log(error);
    }
  });

// exports.getRestaurantReport = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;
//   console.log("ha yahi h report wala controller");
//   const order = await Order.find({
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//     deliveryStatus: ["Delivered"],
//   })
//     // .populate({ path: "deliveredOrderId", model: "OrderReports" })
//     .populate({
//       path: "restaurant",
//       select: "brand_display_name merchant_number location petPooja",
//     })
//     .populate({ path: "customer", select: "name phone" })
//     .populate({
//       path: "deliveryPartner",
//       select: "name phone",
//       populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
//     })
//     .populate({ path: "orderItems", select: "itemTitle" })
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

//   // shivam------------------------------------------------
//   // for (let index = 0; index < order.orderItems.length; index++) {
//   //   const element = order.orderItems[index];
//   //   console.log(element);
//   // }

//   // shivam------------------------------------------------

//   res
//     .status(200)
//     .json({ data: order, total, status: "success", message: "successfully" });
// });
exports.getRestaurantReport = catchAsync(async (req, res, next) => {
    const { page, limit, sort, field } = req.query;
    const skip = page * limit - limit;
    console.log("ha yahi h report wala controller");
    const order = await Order.find({
      paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
      deliveryStatus: ["Delivered"],
    })
      // .populate({ path: "deliveredOrderId", model: "OrderReports" })
      .populate({
        path: "restaurant",
        select: "brand_display_name merchant_number location petPooja",
      })
      .populate({ path: "customer", select: "name phone" })
      .populate({
        path: "deliveryPartner",
        select: "name phone",
        populate: { path: "deliveryPartnerCurrentLocation", select: "location" },
      })
      .populate({ path: "orderItems", select: "itemTitle" })
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
    });
  
    // shivam------------------------------------------------
    // for (let index = 0; index < order.orderItems.length; index++) {
    //   const element = order.orderItems[index];
    //   console.log(element);
    // }
  
    // shivam------------------------------------------------
  
    res
      .status(200)
      .json({ data: order, total, status: "success", message: "successfully" });
  });