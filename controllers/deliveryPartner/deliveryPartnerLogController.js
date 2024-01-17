const DeliveryPartnerLog = require("../../models/deliveryPartner/deliveryPartnerLog");
const DeliveryPartnerLogTime = require("../../models/deliveryPartner/deliveryPartnerLogTime");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
exports.getLogTiming = catchAsync(async (req, res, next) => {
  const logData = await DeliveryPartnerLog.aggregate([
    {
      $match: {
        deliveryPartner: req.deliveryPartner._id,
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
// exports.deliveryPartnerLiveLocation = catchAsync(async (req, res, next) => {
//   try {
//     const deliveryPartner = req.deliveryPartner._id;

//     const locationData = await DeliveryPartnerCurrentLocation.findOne({
//       deliveryPartner: deliveryPartner,
//     });

//     if (!locationData) {
//       return res
//         .status(404)
//         .json({ error: "Delivery partner location not found" });
//     }

//     const location = {
//       type: locationData.location.type,
//       coordinates: locationData.location.coordinates,
//     };

//     res.json(location);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// exports.deliveryPartnerLiveLocation = catchAsync(async (req, res, next) => {
//   try {
//     const partnerId = req.params.partnerId;
//     //     const deliveryPartner = req.deliveryPartner._id;

//     const locationData = await DeliveryPartnerCurrentLocation.findOne({
//       deliveryPartner: partnerId,
//     });

//     if (!locationData) {
//       return res
//         .status(404)
//         .json({ error: "Delivery partner location not found" });
//     }

//     const location = {
//       type: locationData.location.type,
//       coordinates: locationData.location.coordinates,
//       locationUpdatedAt: locationData.locationUpdatedAt,
//     };

//     res.json(location);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

exports.deliveryPartnerLiveLocation = catchAsync(async (req, res, next) => {
  try {
    // const partnerId = req.deliveryPartner._id;
    const partnerId = req.params.partnerId;

    const locationData = await DeliveryPartnerCurrentLocation.findOne({
      deliveryPartner: partnerId,
    });
    console.log(`locationData :${locationData}`);
    if (!locationData) {
      return res
        .status(404)
        .json({ error: "Delivery partner location not found" });
    }

    const location = {};

    // Check if locationData.location is defined
    if (locationData.location) {
      location.type = locationData.location.type;

      location.coordinates = locationData.location.coordinates;
    } else {
      location.type = "Unknown";
      location.coordinates = [0, 0]; // Or any default coordinates
    }

    // Check if locationData.locationUpdatedAt is defined
    if (locationData.locationUpdatedAt) {
      location.locationUpdatedAt = locationData.locationUpdatedAt;
    } else {
      location.locationUpdatedAt = new Date(); // Or any default value
    }

    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
