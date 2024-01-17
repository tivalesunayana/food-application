const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const DeliveryPartner = require("./../../models/deliveryPartner/deliveryPartner");
const DeliveryPartnerReferAndEarn = require("./../../models/deliveryPartner/deliveryPartnerReferAndEarnModel");

const DeliveryPartnerLog = require("../../models/deliveryPartner/deliveryPartnerLog");
const DeliveryPartnerLogTime = require("../../models/deliveryPartner/deliveryPartnerLogTime");
const DeliveryPartnerCashLog = require("./../../models/deliveryPartner/deliveryPartnerCashLogModel");
const moment = require("moment/moment");
const DeliveryPartnerSelfiesOftheDay = require("../../models/deliveryPartner/deliveryPartnerSelfiesOftheDay");
const DeliveryPartnerEarning = require("../../models/deliveryPartner/deliveryPartnerEarning");
const Order = require("../../models/order/orderModel");
const Payment = require("../../models/payment/paymentModel");
// const pdfMake = require("pdfmake");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const get1min = () => {
  const d = new Date();
  return new Date(d.getTime() - 1 * 60000);
};
exports.getLogTiming = catchAsync(async (req, res, next) => {
  // const { startDate, endDate } = req.body;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  function toHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }
  // console.log(req.body, new Date(startDate));
  // const deliveryPartner = await DeliveryPartner.findById(ydeliveryPartnerId);
  // const logData = await DeliveryPartner.aggregate([
  //   {
  //     $match: {
  //       status: "active",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "deliverypartnerloginlogs",
  //       localField: "_id",
  //       foreignField: "deliveryPartner",
  //       pipeline: [
  //         {
  //           $match: {
  //             createdAt: {
  //               $gt: new Date(startDate),
  //               $lt: new Date(endDate),
  //             },
  //           },
  //         },

  //         {
  //           $lookup: {
  //             from: "deliverypartnerloginlogtimes",
  //             let: { pid: "$loginData" },
  //             pipeline: [{ $match: { $expr: { $in: ["$_id", "$$pid"] } } }],
  //             as: "loginData",
  //           },
  //         },
  //         { $sort: { _id: -1 } },
  //       ],
  //       as: "logs",
  //     },
  //   },
  // ]);
  const logData = await DeliveryPartnerLog.aggregate([
    {
      $match: {
        createdAt: { $gt: startDate, $lt: endDate },
        // deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
      },
    },
    {
      $lookup: {
        from: "deliverypartners",
        localField: "deliveryPartner",
        foreignField: "_id",
        as: "deliveryPartner",
      },
    },
    {
      $lookup: {
        from: "deliverypartnerloginlogtimes",
        let: { pid: "$loginData" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
          // { $match: { endTime: { $exists: true } } },
        ],
        as: "loginData",
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

        loginData: {
          $push: {
            $cond: [
              { $eq: ["$dateRange", "$createdAt"] },
              {
                deliveryPartner: "$deliveryPartner",
                loginData: "$loginData",
              },
              // {
              //   // deliveryShare: "$deliveryShare",
              //   // orderId: "$orderId",
              //   // {
              //   //   $match: {
              //   //     deliveryPartner: deliveryPartner._id,
              //   //     createdAt: {
              //   //       $gt: new Date(startDate),
              //   //       $lt: new Date(endDate),
              //   //     },
              //   //   },
              //   // },
              //   // {
              //   //   $lookup: {
              //   //     from: "deliverypartnerloginlogtimes",
              //   //     let: { pid: "$loginData" },
              //   //     pipeline: [
              //   //       { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
              //   //       // { $match: { endTime: { $exists: true } } },
              //   //     ],
              //   //     as: "loginData",
              //   //   },
              //   // },
              //   // { $sort: { _id: -1 } },
              // },
              "$$REMOVE",
            ],
          },
        },
      },
    },
    { $sort: { _id: -1 } },
    // { $addFields: { total: { $sum: "$order.deliveryShare" } } },
    // { $addFields: { date: { $sum: "$_id" } } },
    {
      $project: {
        // date: "$_id",
        loginData: "$loginData",
        // total: "$total",
      },
    },
  ]);
  const data = [];
  for (let index = 0; index < logData.length; index++) {
    const element1 = logData[index];
    element1.date = moment(element1._id).format("DD/MM/YYYY");
    for (let j = 0; j < element1.loginData.length; j++) {
      const element2 = element1.loginData[j];
      element2.deliveryPartner = {
        name: element2.deliveryPartner[0]
          ? element2.deliveryPartner[0].name
          : console.log("element2"),
        status: element2.deliveryPartner[0]
          ? element2.deliveryPartner[0].status
          : console.log("element2"),
        phone: element2.deliveryPartner[0]
          ? element2.deliveryPartner[0].phone
          : console.log("element2"),
        minutes: 0,
      };

      // element2.deliveryPartner.time = 0;
      for (let index = 0; index < element2.loginData.length; index++) {
        const element = element2.loginData[index];
        if (element.endTime) {
          const dd = Math.floor(
            (element.endTime - element.startTime) / 1000 / 60
          );
          element.differenceMinutes = dd;
          element2.deliveryPartner.minutes =
            element2.deliveryPartner.minutes + dd;
        } else {
          element.differenceMinutes = null;
          element.endTime = null;
        }
      }
      element2.deliveryPartner.timeInHours = toHoursAndMinutes(
        element2.deliveryPartner.minutes
      );
    }

    data.push(element1);
  }
  const newData = [
    // {
    //   date: "",
    //   deliveryPartner: [],
    //   // "Column 2": "01/06/2023",
    //   // "Column 3": "31/05/2023",
    //   // "Column 4": "1-4",
    // },
  ];
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const dd = {
      date: element.date,
      deliveryPartner: [],
    };
    console.log(`dd : ${dd}`);
    for (let j = 0; j < element.loginData.length; j++) {
      const element2 = element.loginData[j];
      // console.log(element2.deliveryPartner);
      if (element2.deliveryPartner.status === "active") {
        const ddd = {
          name: element2.deliveryPartner.name,
          phone: element2.deliveryPartner.phone,
          timeInHours: element2.deliveryPartner.timeInHours,
          image: element2.deliveryPartner.image,
        };
        console.log(`dd : ${ddd}`);

        dd.deliveryPartner.push(ddd);
      }
    }
    newData.push(dd);
    console.log(`data :${newData}`);
  }
  res.status(200).json({
    status: "success",
    message: "successful",
    // data,
    data: newData,
  });
});

exports.searchDeliveryPartner = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await DeliveryPartner.find({
    name: { $regex: new RegExp(query, "i") },
    status: "active",
  })
    .populate("address")
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

// exports.getDeliveryPartner = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;
//   const deliveryPartner = await DeliveryPartner.find({
//     status: ["active", "suspended"],
//   })
//     .populate("address") // Add this line to populate the address field
//     .populate("bankDetail")
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await DeliveryPartner.count({
//     status: ["active", "suspended"],
//   });
//   res.status(200).json({
//     data: deliveryPartner,
//     total,
//     status: "success",
//     message: "successfully",
//   });
// });
exports.getDeliveryPartner = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, city } = req.query;
  const skip = page * limit - limit;

  const deliveryPartner = await DeliveryPartner.find({
    status: ["active", "suspended"],
  })
    .populate("bankDetail")
    .populate({ path: "address", select: "city" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const formattedCity = city ? city.trim().toLowerCase() : null;

  const filteredDeliveryPartners = city
    ? deliveryPartner.filter(
        (del) =>
          del.address &&
          del.address.city &&
          del.address.city.trim().toLowerCase() === formattedCity
      )
    : deliveryPartner;

  res.status(200).json({
    total: filteredDeliveryPartners.length,
    data: filteredDeliveryPartners,
    status: "success",
    message: "successfully",
  });
});
//filter delivery Partner by city
exports.getDeliveryPartnerByCity = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const deliveryPartner = await DeliveryPartner.find({
    status: ["active", "suspended"],
  })
    .populate({ path: "address", select: "city" })
    .populate("bankDetail")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const filteredDeliveryPartners = deliveryPartner.filter((del) => {
    return (
      del.address &&
      del.address.city &&
      del.address.city.toLowerCase() === req.query.city.toLowerCase()
    );
  });

  res.status(200).json({
    total: filteredDeliveryPartners.length,
    filteredDeliveryPartners,
    status: "success",
    message: "successfully",
  });
});

exports.suspendDeliveryPartner = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { deliveryPartnerId } = req.query;
  const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
  deliveryPartner.status = status;
  await deliveryPartner.save();
  res.status(200).json({
    status: "success",
    message: `Successfully ${
      deliveryPartner.status === "suspended" ? "Block" : "Unblocked"
    }`,
  });
});

exports.getDeliveryPartnerUnverified = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const deliveryPartner = await DeliveryPartner.find({ status: "pending" })
    .populate({ path: "address", select: "city" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);
  const filteredDeliveryPartners = deliveryPartner.filter((del) => {
    return (
      del.address &&
      del.address.city &&
      del.address.city.toLowerCase() === req.query.city.toLowerCase()
    );
  });

  const total = await DeliveryPartner.count({ status: "pending" });
  res.status(200).json({
    data: filteredDeliveryPartners,
    total: filteredDeliveryPartners.length,
    status: "success",
    message: "successfully",
  });
});
// exports.getDeliveryPartnerPending = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;
//   const deliveryPartner = await DeliveryPartner.find({ status: "pending" })
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await DeliveryPartner.count({ status: "pending" });
//   res.status(200).json({
//     data: deliveryPartner,
//     total,
//     status: "success",
//     message: "successfully",
//   });
// });
//delivery partner pending 


exports.getDeliveryPartnerPending = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field ,city} = req.query;
  const skip = page * limit - limit;
  const deliveryPartner = await DeliveryPartner.find({ status: "pending" })
  .populate({ path: "address", select: "city" })

    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

    const formattedCity = city ? city.trim().toLowerCase() : null;

    const filteredDeliveryPartners = city
      ? deliveryPartner.filter(
          (del) =>
            del.address &&
            del.address.city &&
            del.address.city.trim().toLowerCase() === formattedCity
        )
      : deliveryPartner;
  
    res.status(200).json({
      total: filteredDeliveryPartners.length,
      data: filteredDeliveryPartners,
      status: "success",
      message: "successfully",
  });
});



exports.approveDeliveryPartner = catchAsync(async (req, res, next) => {
  const { deliveryPartnerId } = req.query;
  const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
  if (!deliveryPartner.bankDetail) {
    return next(new AppError("Document not updated ", 401));
  }
  deliveryPartner.status = "active";
  await deliveryPartner.save();
  res.status(200).json({
    data: deliveryPartner,

    status: "success",
    message: "successfully active ",
  });
});

exports.getReferAndEarnAmount = catchAsync(async (req, res, next) => {
  const referAndEarn = await DeliveryPartnerReferAndEarn.findOne();
  if (!referAndEarn) {
    const data = await DeliveryPartnerReferAndEarn.create({ amount: 50 });
    res.status(200).json({
      data,

      status: "success",
      message: "successfully",
    });
  } else {
    res.status(200).json({
      data: referAndEarn,

      status: "success",
      message: "successfully",
    });
  }
});

exports.updateReferAndEarnAmount = catchAsync(async (req, res, next) => {
  const referAndEarn = await DeliveryPartnerReferAndEarn.findOne();
  const { amount } = req.body;
  referAndEarn.amount = amount;
  await referAndEarn.save();
  res.status(200).json({
    data: referAndEarn,
    status: "success",
    message: "successfully",
  });
});

exports.getLiveLocationOfDeliveryPartner = catchAsync(
  async (req, res, next) => {
    const availablePartners = await DeliveryPartnerCurrentLocation.find({
      locationUpdatedAt: { $gt: new Date(get1min()) },
      currentOrder: { $exists: false },
    }).populate("deliveryPartner");
    const availablePartnersData = [];
    for (let index = 0; index < availablePartners.length; index++) {
      const element = availablePartners[index];
      if (element.deliveryPartner.status === "active") {
        availablePartnersData.push({
          type: "Feature",
          properties: {
            description: `<strong>${element.deliveryPartner.name}</strong><p></p>`,
          },
          geometry: {
            type: "Point",
            coordinates: element.location.coordinates,
          },
        });
      }
    }
    const busyPartners = await DeliveryPartnerCurrentLocation.find({
      locationUpdatedAt: { $gt: new Date(get1min()) },

      currentOrder: { $exists: true },
    })
      .populate("deliveryPartner")
      .populate("currentOrder");

    const busyPartnersData = [];
    for (let index = 0; index < busyPartners.length; index++) {
      const element = busyPartners[index];
      if (element.deliveryPartner.status === "active") {
        busyPartnersData.push({
          type: "Feature",
          properties: {
            description: `<strong>${element.deliveryPartner.name}</strong><p>${element.currentOrder.orderId}</p>`,
          },
          geometry: {
            type: "Point",
            coordinates: element.location.coordinates,
          },
        });
      }
    }

    const offlinePartners = await DeliveryPartnerCurrentLocation.find({
      locationUpdatedAt: { $lt: new Date(get1min()) },
    }).populate("deliveryPartner");

    const offlinePartnersData = [];
    for (let index = 0; index < offlinePartners.length; index++) {
      const element = offlinePartners[index];
      if (element.deliveryPartner.status === "active") {
        offlinePartnersData.push({
          type: "Feature",
          properties: {
            description: `<strong>${
              element.deliveryPartner
                ? element.deliveryPartner.name
                : console.log(element._id)
            }</strong><p></p>`,
          },
          geometry: {
            type: "Point",
            coordinates: element.location.coordinates,
          },
        });
      }
    }
    res.status(200).json({
      status: "success",
      message: "Success",
      busyPartnersData,
      availablePartnersData,
      offlinePartnersData,
    });
  }
);

exports.deliveryPartnerAmountSubmit = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { deliveryPartnerCurrentLocationId } = req.query;
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      deliveryPartnerCurrentLocationId
    );

  const deliveryPartnerCashLog = await DeliveryPartnerCashLog.create({
    amountSubmitted: amount,
    deliveryPartner: deliveryPartnerCurrentLocation.deliveryPartner,
  });
  deliveryPartnerCurrentLocation.deliveryPartnerCashLog.push(
    deliveryPartnerCashLog._id
  );
  deliveryPartnerCurrentLocation.cashAmount =
    deliveryPartnerCurrentLocation.cashAmount - amount;
  await deliveryPartnerCurrentLocation.save();
  res
    .status(200)
    .json({ status: "success", message: "Amount submitted successfully" });
});

// exports.deliveryPartnerCashData = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;
//   const data = await DeliveryPartnerCurrentLocation.find()
//     .populate("deliveryPartner")
//     .populate("deliveryPartnerCashLog")
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await DeliveryPartnerCurrentLocation.count();
//   res
//     .status(200)
//     .json({ status: "success", message: "Successfully", data, total });
// });
exports.deliveryPartnerCashData = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field ,city} = req.query;
  const skip = page * limit - limit;
  const data = await DeliveryPartnerCurrentLocation.find()
  .populate({
    path: "deliveryPartner",
    populate: {
      path: "address",
      select: "city name"
    }
  })
  .populate("deliveryPartnerCashLog")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);
    const formattedCity = city ? city.trim().toLowerCase() : null;
 const filteredDeliveryPartners = city ?
    data.filter((del) => (
      del.deliveryPartner &&
      del.deliveryPartner.address &&
      del.deliveryPartner.address.city &&
      del.deliveryPartner.address.city.trim().toLowerCase() === formattedCity
    ))
    :
    data;
  res
    .status(200)
    .json({ status: "success", message: "Successfully", filteredDeliveryPartners, total:filteredDeliveryPartners.length });
});
exports.getSingleLogTiming = catchAsync(async (req, res, next) => {
  const { deliveryPartnerId } = req.query;
  const { startDate, endDate } = req.body;
  console.log(req.body, new Date(startDate));
  const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
  const logData = await DeliveryPartnerLog.aggregate([
    {
      $match: {
        deliveryPartner: deliveryPartner._id,
        createdAt: {
          $gt: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    {
      $lookup: {
        from: "deliverypartnerloginlogtimes",
        let: { pid: "$loginData" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
          // { $match: { endTime: { $exists: true } } },
        ],
        as: "loginData",
      },
    },
    { $sort: { _id: -1 } },
  ]);
  const data = [];
  for (let index = 0; index < logData.length; index++) {
    const element1 = logData[index];
    element1.todayTotal = 0;
    for (let index = 0; index < element1.loginData.length; index++) {
      const element = element1.loginData[index];
      console.log(element1);
      if (element.endTime) {
        const dd = Math.floor(
          (element.endTime - element.startTime) / 1000 / 60
        );
        element.difference = dd;
        element1.todayTotal = element1.todayTotal + dd;
      } else {
        element.difference = null;
        element.endTime = null;
      }
    }

    data.push(element1);
  }
  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});
// exports.getTodayDeliveryselfie = catchAsync(async (req, res, next) => {
//   try {
//     const deliveryPartnerSelfies =
//       await DeliveryPartnerSelfiesOftheDay.find().populate({
//         path: "deliveryPartner",
//         select: "name phone",
//       });

//     res.status(200).json({
//       status: "success",
//       data: deliveryPartnerSelfies,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });
exports.getTodayDeliveryselfie = catchAsync(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const deliveryPartnerSelfies = await DeliveryPartnerSelfiesOftheDay.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    }).populate({
      path: "deliveryPartner",
      select: "name phone",
    });

    res.status(200).json({
      status: "success",
      data: deliveryPartnerSelfies,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

exports.getLiveDeliveryPartner = catchAsync(async (req, res, next) => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const availablePartners = await DeliveryPartnerCurrentLocation.find({
    locationUpdatedAt: { $gt: new Date(get1min()) },
  }).populate({
    path: "deliveryPartner",
  });
  console.log(`deliverypartner populate:${availablePartners.deliveryPartner}`);
  const data = [];
  for (let index = 0; index < availablePartners.length; index++) {
    const element = availablePartners[index];
    if (element.deliveryPartner.status === "active") {
      const deliveryPartnerLogCheck = await DeliveryPartnerLog.findOne({
        loginDate: { $gte: start, $lt: end },
        deliveryPartner: element.deliveryPartner._id,
      });
      data.push({
        ...element.toObject({ getters: true }),
        deliveryPartnerLogCheck,
      });
    }
  }
  res.status(200).json({
    status: "success",
    message: "Success",
    data,
  });
});

//getting
// exports.deliveryEarning = catchAsync(async (req, res, next) => {
//   try {
//     const { deliveryPartnerId, amount, daysAbsent } = req.body;
//     console.log("Delivery Partner ID:", deliveryPartnerId);

//     // Check if the delivery partner exists
//     const deliveryPartnerExists = await DeliveryPartner.exists({
//       _id: deliveryPartnerId,
//     });

//     if (!deliveryPartnerExists) {
//       console.error(`Delivery Partner with ID ${deliveryPartnerId} not found.`);
//       return res
//         .status(404)
//         .json({ status: "error", error: "Delivery Partner not found." });
//     }

//     // Check if an earning record already exists for the deliveryPartnerId
//     const existingEarning = await DeliveryPartnerEarning.findOne({
//       deliveryPartner: deliveryPartnerId,
//     });

//     let earning;

//     if (existingEarning) {
//       earning = await DeliveryPartnerEarning.findByIdAndUpdate(
//         existingEarning._id,
//         {
//           amount,
//         },
//         { new: true }
//       );
//     } else {
//       earning = await DeliveryPartnerEarning.create({
//         deliveryPartner: deliveryPartnerId,
//         amount,
//       });
//     }

//     // Calculate monthly salary based on daily earnings
//     const daysInMonth = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth() + 1,
//       0
//     ).getDate();
//     console.log(`days:${daysInMonth}`);
//     const dailyEarning = amount;
//     const monthlySalary = dailyEarning * daysInMonth;
//     console.log(`month:${monthlySalary}`);
//     let deductionAbsenty;
//     if (daysAbsent === 0 || daysInMonth === 0) {
//       deductionAbsenty = 0;
//     } else {
//       deductionAbsenty = (monthlySalary / daysInMonth) * daysAbsent;
//     }

//     if (isNaN(deductionAbsenty)) {
//       console.error("Error: deductionAbsenty is NaN.");
//       deductionAbsenty = 0;
//     }
//     let amountPayToDeliveryBoy = 0;
//     if (deductionAbsenty !== 0) {
//       amountPayToDeliveryBoy = monthlySalary / deductionAbsenty;
//     }
//     const result = await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
//       $inc: {
//         totalMonthlyEarnings: monthlySalary,
//         dailyEarning: dailyEarning,
//         deductionAbsenty: deductionAbsenty,
//         amountPayToDeliveryBoy: amountPayToDeliveryBoy,
//       },
//     });

//     if (!result) {
//       console.error(
//         `Failed to update dailyEarning for deliveryPartnerId: ${deliveryPartnerId}`
//       );
//     }

//     // Log the updated result
//     console.log(`result:${result}`);
//     res.json({ status: "success", earning });
//   } catch (error) {
//     res.status(500).json({ status: "error", error: error.message });
//   }
// });
// exports.deliveryEarning = catchAsync(async (req, res, next) => {
//   const { deliveryPartnerId, amount, daysAbsent, paymentRelease } = req.body;

//   const deliveryPartnerExists = await DeliveryPartner.exists({
//     _id: deliveryPartnerId,
//   });

//   if (!deliveryPartnerExists) {
//     console.error(`Delivery Partner with ID ${deliveryPartnerId} not found.`);
//     return res
//       .status(404)
//       .json({ status: "error", error: "Delivery Partner not found." });
//   }

//   const existingEarning = await DeliveryPartnerEarning.findOne({
//     deliveryPartner: deliveryPartnerId,
//   });

//   let earning;

//   if (existingEarning) {
//     earning = await DeliveryPartnerEarning.findByIdAndUpdate(
//       existingEarning._id,
//       {
//         amount,
//       },
//       { new: true }
//     );
//   } else {
//     earning = await DeliveryPartnerEarning.create({
//       deliveryPartner: deliveryPartnerId,
//       amount,
//     });
//   }

//   const daysInMonth = new Date(
//     new Date().getFullYear(),
//     new Date().getMonth() + 1,
//     0
//   ).getDate();
//   console.log(`days:${daysInMonth}`);
//   const dailyEarning = amount;
//   const monthlyEarning = dailyEarning * daysInMonth;
//   console.log(`month:${monthlyEarning}`);
//   let deductionAbsenty = 0;

//   if (daysAbsent > 0 && daysInMonth > 0) {
//     deductionAbsenty = (monthlyEarning / daysInMonth) * daysAbsent;
//   }

//   if (isNaN(deductionAbsenty)) {
//     console.error("Error: deductionAbsenty is NaN.");
//     deductionAbsenty = 0;
//   }
//   let amountPayToDeliveryBoy = monthlyEarning - deductionAbsenty;
//   if (paymentRelease === true) {
//     amountPayToDeliveryBoy = 0;
//   }
//   const result = await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
//     dailyEarning: dailyEarning,
//     totalMonthlyEarnings: monthlyEarning,

//     $inc: {
//       deductionAbsenty: deductionAbsenty,
//       amountPayToDeliveryBoy: amountPayToDeliveryBoy,
//     },
//   });

//   if (!result) {
//     console.error(
//       `Failed to update dailyEarning for deliveryPartnerId: ${deliveryPartnerId}`
//     );
//   }

//   res.json({ status: "success", earning });
// });
//dec22 momoin
exports.deliveryEarning = catchAsync(async (req, res, next) => {
  const deliveryPartnerId = req.query.deliveryPartnerId;
  const orders = await Order.find({
    status: Delivered,
    deliveryPartnerId: deliveryPartnerId,
  });

  let totalEarned = 0;
  for (const order of orders) {
    const deliveryPartner = await DeliveryPartner.findById(
      order.deliveryPartner
    );

    if (deliveryPartner && deliveryPartner.amount > 0) {
      totalEarned += deliveryPartner.amount;
    }
  }

  totalEarned += 350;

  console.log("Total Earned:", totalEarned);
  res.status(200).json({ message: "succses", data: totalEarned });
});
//momin
// API to set daily earnings for a delivery partner
// router.post("/set-daily-earnings", async (req, res) => {
//   try {
//     const { deliveryPartnerId, amount } = req.body;
//     const earning = new DeliveryPartnerEarning({
//       deliveryPartner: deliveryPartnerId,
//       amount,
//     });
//     await earning.save();

//     // Update total daily earnings in the DeliveryPartner model
//     await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
//       $inc: { dailyEarning: amount },
//     });

//     res.json({ status: "success", earning });
//   } catch (error) {
//     res.status(500).json({ status: "error", error: error.message });
//   }
// });

// API to get earnings for a delivery partner within a date range
// router.get("/earnings", async (req, res) => {
//   try {
//     const { deliveryPartnerId, startDate, endDate } = req.query;
//     const earnings = await DeliveryPartnerEarning.find({
//       deliveryPartner: deliveryPartnerId,
//       date: { $gte: startDate, $lte: endDate },
//     });
//     res.json({ status: "success", earnings });
//   } catch (error) {
//     res.status(500).json({ status: "error", error: error.message });
//   }
// });

// // API to deduct earnings for absence
// router.post('/deduct-earnings', async (req, res) => {
//   try {
//     const { deliveryPartnerId, daysAbsent } = req.body;

//     // Fetch daily earning amount for the delivery partner
//     const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
//     const dailyEarningAmount = deliveryPartner.dailyEarning || 0;

//     // Calculate deduction amount
//     const deductionAmount = daysAbsent * dailyEarningAmount;

//     // Deduct earnings in the DeliveryPartner model
//     await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
//       $inc: { dailyEarning: -deductionAmount },
//     });

//     res.json({ status: 'success', deductionAmount });
//   } catch (error) {
//     res.status(500).json({ status: 'error', error: error.message });
//   }
// });

// module.exports = router;
exports.getCashLog = catchAsync(async (req, res, next) => {
  const { deliveryPartnerId } = req.params;

  const orders = await Order.find({
    deliveryPartner: deliveryPartnerId,
  })
    .populate("deliveryPartner")
    .populate("payment");
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.find({
      deliveryPartner: deliveryPartnerId,
    });
  const payments = await Payment.find({
    deliveryPartner: deliveryPartnerId,
  }).populate({
    path: "order",
    model: Order,
    select: "deliveryPartner",
  });
  const cashLog = await DeliveryPartnerCashLog.find({
    deliveryPartner: deliveryPartnerId,
  });
  console.log(`cashLog:${cashLog}`);

  const documentDefinition = {
    content: [
      { text: "Delivery Partner Cash Log Report", style: "header" },
      {
        text: `Delivery Partner Name: ${
          orders.length > 0 ? orders[0].deliveryPartner.name : "N/A"
        }`,
        style: "subheader",
      },
      { text: "Order Details", style: "subheader" },
      {
        style: "tableExample",
        table: {
          widths: ["*", "*", "*", "*", "*"],
          body: [
            [
              "Sr.No.",
              "Order ID",
              "paymentMode",
              "amount",
              "customer Payment Amount",
            ],
            ...orders.map((order, index) => [
              index + 1,
              order.orderId,
              order.payment.paymentMode,
              order.payment.amount.toFixed(2),

              order.paymentAmount.toFixed(2),
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        alignment: "center",
      },
    },
  };

  // Generate the PDF
  const pdfDoc = pdfMake.createPdf(documentDefinition);

  pdfDoc.getBuffer((buffer) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=delivery_Order_report.pdf"
    );
    res.end(buffer);
  });
});
exports.getCashLogRemaining = catchAsync(async (req, res, next) => {
  const { deliveryPartnerId } = req.params;

  const orders = await Order.find({
    deliveryPartner: deliveryPartnerId,
  })
    .populate("deliveryPartner")
    .populate("payment");
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.find({
      deliveryPartner: deliveryPartnerId,
    });
  const payments = await Payment.find({
    deliveryPartner: deliveryPartnerId,
  }).populate({
    path: "order",
    model: Order,
    select: "deliveryPartner",
  });
  const cashLog = await DeliveryPartnerCashLog.find({
    deliveryPartner: deliveryPartnerId,
  });

  const documentDefinition = {
    content: [
      { text: "Delivery Partner Cash Log Report", style: "header" },
      {
        text: `Delivery Partner Name: ${
          orders.length > 0 ? orders[0].deliveryPartner.name : "N/A"
        }`,
        style: "subheader",
      },

      {
        style: "tableExample",
        color: "#444",
        table: {
          widths: ["auto", "auto", "auto", "auto"],
          headerRows: 2,
          body: [
            [
              {
                text: "Amount Settled",
                style: "tableHeader",
                colSpan: 3,
                alignment: "center",
              },
              {},
              {},
              {},
            ],
            ["Sr No", "Amount Submitted", "Date", "Cash Amount"],
            ...cashLog.map((log, index) => [
              index + 1,
              log.amountSubmitted,
              new Date(log.date).toLocaleString(),
              deliveryPartnerCurrentLocation.length > index
                ? deliveryPartnerCurrentLocation[index].cashAmount
                : "N/A",
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        alignment: "center",
      },
    },
  };

  // Generate the PDF
  const pdfDoc = pdfMake.createPdf(documentDefinition);

  // Send the PDF as a download to the client
  pdfDoc.getBuffer((buffer) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=CashLog_report.pdf"
    );
    res.end(buffer);
  });
});
