require("dotenv").config();
const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const jwt = require("jsonwebtoken");
const { verifyFirebaseToken } = require("./../../config/firebase");
const DeliveryPartnerLoginLog = require("../../models/deliveryPartner/deliveryPartnerLog");
const { uploadImg } = require("../../config/s3config");
const DeliveryPartnerLog = require("../../models/deliveryPartner/deliveryPartnerLog");
const DeliveryPartnerLogTime = require("../../models/deliveryPartner/deliveryPartnerLogTime");
const DeliveryPartnerOrderData = require("../../models/deliveryPartner/deliveryPartnerOrderData");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const DeliveryPartnerSelfie = require("../../models/deliveryPartner/deliveryPartnerSelfieModel");
const Version = require("../../models/versionModel");
const DeliveryPartnerSelfiesOftheDay = require("../../models/deliveryPartner/deliveryPartnerSelfiesOftheDay");
exports.randomSelfie = catchAsync(async (req, res, next) => {
  const file = req.file;
  const { accepted } = req.body;
  const createData = { deliveryPartner: req.deliveryPartner._id };
  if (accepted && file) {
    const response = await uploadImg(file);
    createData.image = response.Key;
    createData.accepted = true;
  } else {
    createData.accepted = false;
  }
  const data = await DeliveryPartnerSelfie.create(createData);
  res.status(200).json({
    message: "Selfie upload successfully",
    status: "success",
    data,
  });
});

exports.uploadLoginSelfie = catchAsync(async (req, res, next) => {
  const file = req.file;
  const response = await uploadImg(file);
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);
  const deliveryPartnerLogCheck = await DeliveryPartnerLoginLog.findOne({
    loginDate: { $gte: start, $lt: end },
    deliveryPartner: req.deliveryPartner._id,
  });
  if (deliveryPartnerLogCheck) {
    deliveryPartnerLogCheck.image = response.Key;
    await deliveryPartnerLogCheck.save();
  } else {
    await DeliveryPartnerLoginLog.create({
      deliveryPartner: req.deliveryPartner._id,
      loginDate: new Date(),
      image: response.Key,
    });
  }
  res
    .status(200)
    .json({ status: "success", message: "Image saved successfully" });
});

// exports.uploadDeliveryselfie = catchAsync(async (re, res, next) => {
//   try {
//     const file = req.file;
//     const response = await uploadImg(file);

//     // Create or update a DeliveryPartnerLoginLog entry with the image information
//     var start = new Date();
//     start.setHours(0, 0, 0, 0);
//     var end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const deliveryPartnerLogCheck = await DeliveryPartnerLoginLog.findOne({
//       loginDate: { $gte: start, $lt: end },
//       deliveryPartner: req.deliveryPartner._id,
//     });
//     if (!deliveryPartnerLogCheck.deliveryPartner) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Delivery partner not found." });
//     }

//     if (deliveryPartnerLogCheck) {
//       deliveryPartnerLogCheck.image = response.Key;
//       await deliveryPartnerLogCheck.save();
//     } else {
//       await DeliveryPartnerLoginLog.create({
//         deliveryPartner: req.deliveryPartner._id,
//         loginDate: new Date(),
//         image: response.Key,
//       });
//     }

//     res
//       .status(200)
//       .json({ status: "success", message: "Image saved successfully" });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

exports.uploadDeliveryselfie = catchAsync(async (req, res, next) => {
  try {
    if (req.deliveryPartner.status !== "active") {
      return res
        .status(400)
        .json({ status: "error", message: "Delivery partner is not active." });
    }

    const file = req.file;
    const response = await uploadImg(file);

    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const deliveryPartnerSelfies = await DeliveryPartnerSelfiesOftheDay.findOne(
      {
        date: { $gte: startOfDay, $lt: endOfDay },
        deliveryPartner: req.deliveryPartner._id,
      }
    );

    if (deliveryPartnerSelfies) {
      if (deliveryPartnerSelfies.image.length >= 2) {
        return res.status(400).json({
          status: "error",
          message:
            "You've already uploaded the maximum number of selfies for today.",
        });
      }

      // Add the new selfie
      deliveryPartnerSelfies.image.push(response.Key);
      await deliveryPartnerSelfies.save();
    } else {
      await DeliveryPartnerSelfiesOftheDay.create({
        deliveryPartner: req.deliveryPartner._id,
        date: currentDate,
        image: [response.Key],
      });
    }

    res.status(200).json({
      status: "success",
      message: "Image saved successfully",
      data: deliveryPartnerSelfies,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
// exports.uploadDeliveryselfie = catchAsync(async (req, res, next) => {
//   try {
//     if (req.deliveryPartner.status !== "active") {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Delivery partner is not active." });
//     }

//     const file = req.file;
//     const response = await uploadImg(file);

//     // Get the current date and time
//     const currentDate = new Date();

//     // Find the record for the current date and the specific delivery partner
//     const deliveryPartnerSelfies = await DeliveryPartnerSelfiesOftheDay.findOne({
//       date: currentDate,
//       deliveryPartner: req.deliveryPartner._id,
//     });

//     if (deliveryPartnerSelfies) {
//       // Check if the delivery partner has already uploaded two selfies today
//       if (deliveryPartnerSelfies.image1 && deliveryPartnerSelfies.image2) {
//         return res.status(400).json({
//           status: "error",
//           message: "You've already uploaded the maximum number of selfies for today.",
//         });
//       }

//       // If image1 is empty, add the new selfie to image1
//       if (!deliveryPartnerSelfies.image1) {
//         deliveryPartnerSelfies.image1 = response.Key;
//       } else {
//         // If image1 is already occupied, add the new selfie to image2
//         deliveryPartnerSelfies.image2 = response.Key;
//       }

//       await deliveryPartnerSelfies.save();
//     } else {
//       // Create a new record for the day and add the first selfie to image1
//       await DeliveryPartnerSelfiesOftheDay.create({
//         deliveryPartner: req.deliveryPartner._id,
//         date: currentDate,
//         image1: response.Key,
//       });
//     }

//     res
//       .status(200)
//       .json({ status: "success", message: "Image saved successfully" });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// exports.getTodayDeliveryselfie = catchAsync(async (req, res, next) => {
//   try {
//     const deliveryPartnerSelfies = await DeliveryPartnerSelfiesOftheDay.find().populate("deliverypartner")

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
    const deliveryPartnerSelfies =
      await DeliveryPartnerSelfiesOftheDay.find().populate({
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

exports.deliveryPartnerSelfieCheck = catchAsync(async (req, res, next) => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);
  const deliveryPartnerLogCheck = await DeliveryPartnerLoginLog.findOne({
    loginDate: { $gte: start, $lt: end },
    deliveryPartner: req.deliveryPartner._id,
  });
  if (deliveryPartnerLogCheck && deliveryPartnerLogCheck.image) {
    res.status(200).json({ status: "success", message: "Image saved" });
  } else {
    res.status(404).json({ status: "success", message: "Image saved" });
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  const deliveryPartnerCurrentLocation =
    await DeliveryPartnerCurrentLocation.findById(
      req.deliveryPartner.deliveryPartnerCurrentLocation._id
    );
  deliveryPartnerCurrentLocation.online = false;
  await deliveryPartnerCurrentLocation.save();
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);
  const deliveryPartnerLogCheck = await DeliveryPartnerLog.findOne({
    loginDate: { $gte: start, $lt: end },
    deliveryPartner: req.deliveryPartner._id,
  });
  if (deliveryPartnerLogCheck) {
    const deliveryPartnerLogTime = await DeliveryPartnerLogTime.findById(
      deliveryPartnerLogCheck.loginData[
        deliveryPartnerLogCheck.loginData.length - 1
      ]
    );
    deliveryPartnerLogTime.endTime = new Date();
    await deliveryPartnerLogTime.save();
  }

  res.status(200).json({ status: "success", message: "successfully" });
});

exports.getAppVersion = catchAsync(async (req, res, next) => {
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.dpAndroidVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
});

exports.getAppIosVersion = catchAsync(async (req, res, next) => {
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.dpIosVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
});

exports.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, notificationToken } = req.body;
  console.log(`authToken:${authToken} `);
  console.log(`notificationToken:${notificationToken}`);
  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const deliveryPartner = await DeliveryPartner.findOne({
        phone: tokenValue.phone_number,
      }).populate("deliveryPartnerCurrentLocation");
      if (deliveryPartner) {
        const token = await createSendToken(deliveryPartner);

        if (notificationToken) {
          deliveryPartner.notificationToken = notificationToken;
          await deliveryPartner.save();
        } else {
        }

        // write log
        if (deliveryPartner.deliveryPartnerCurrentLocation) {
          const deliveryPartnerCurrentLocation =
            await DeliveryPartnerCurrentLocation.findById(
              deliveryPartner.deliveryPartnerCurrentLocation._id
            );
          deliveryPartnerCurrentLocation.online = true;
          await deliveryPartnerCurrentLocation.save();
          try {
            var start = new Date();
            start.setHours(0, 0, 0, 0);
            var end = new Date();
            end.setHours(23, 59, 59, 999);
            const deliveryPartnerLogCheck = await DeliveryPartnerLog.findOne({
              loginDate: { $gte: start, $lt: end },
              deliveryPartner: deliveryPartner._id,
            });
            if (!deliveryPartnerLogCheck) {
              const deliveryPartnerLog = await DeliveryPartnerLog.create({
                deliveryPartner: deliveryPartner._id,
                loginDate: new Date(),
              });
              const deliveryPartnerLogTime =
                await DeliveryPartnerLogTime.create({
                  startTime: new Date(),
                  deliveryPartnerLoginLog: deliveryPartnerLog._id,
                });
              deliveryPartnerLog.loginData.push(deliveryPartnerLogTime._id);
              await deliveryPartnerLog.save();
            } else {
              const deliveryPartnerLogTimeCheck =
                await DeliveryPartnerLogTime.findById(
                  deliveryPartnerLogCheck.loginData[
                    deliveryPartnerLogCheck.loginData.length - 1
                  ]
                );
              if (
                deliveryPartnerLogTimeCheck ||
                deliveryPartnerLogCheck.loginData === 0
              ) {
                if (deliveryPartnerLogTimeCheck.endTime) {
                  const deliveryPartnerLogTime =
                    await DeliveryPartnerLogTime.create({
                      startTime: new Date(),
                      deliveryPartnerLoginLog: deliveryPartnerLogCheck._id,
                    });
                  deliveryPartnerLogCheck.loginData.push(
                    deliveryPartnerLogTime._id
                  );
                  await deliveryPartnerLogCheck.save();
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          const deliveryPartnerCurrentLocation =
            await DeliveryPartnerCurrentLocation.create({
              location: {
                type: "Point",
                coordinates: [72.9719009, 19.1917138],
              },
              deliveryPartner: deliveryPartner._id,
            });
          deliveryPartner.deliveryPartnerCurrentLocation =
            deliveryPartnerCurrentLocation._id;
          await deliveryPartner.save();
        }
        // end log
        // end log
        console.log(`token:: ${token}`);
        res.status(200).json({
          status: "success",
          message: "successFully",
          deliveryPartner,
          token,
        });
      } else {
        return next(
          new AppError(
            "deliveryPartner not found Kindly create deliveryPartner",
            404
          )
        );
      }
    } else {
      return next(new AppError("Invalid Token ", 409));
    }
  }
});

exports.signupWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, notificationToken, email, gender, name } = req.body;

  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const deliveryPartner = await DeliveryPartner.findOne({
        phone: tokenValue.phone_number,
      }).populate("vehicle");

      if (deliveryPartner) {
        const token = createSendToken(deliveryPartner);
        res.status(200).json({
          status: "success",
          message: "successFully",
          deliveryPartner,
          token,
        });
      } else {
        const newDeliveryPartner = await DeliveryPartner.create({
          phone: tokenValue.phone_number,
          notificationToken,
          email,
          gender,
          name,
        });
        const token = createSendToken(newDeliveryPartner);

        res.status(200).json({
          status: "Created",
          message: "deliveryPartner create successfully",
          data: newDeliveryPartner,
          token,
        });
      }
    } else {
      return next(new AppError("invalid Token ", 500));
    }
  }
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (deliveryPartner) => {
  return (token = signToken(deliveryPartner._id));
};

exports.dashboard = catchAsync(async (req, res, next) => {
  const deliveryPartner = await req.deliveryPartner;
  res.status(200).json({
    status: "success",
    message: "Successfully",
    data: deliveryPartner,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`delivry token::${token}`);
    if (!token) {
      return next(
        new AppError("you are not logged in ! please log in to get access", 401)
      );
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const deliveryPartner = await DeliveryPartner.findById(decoded.id)
        .populate("vehicle")
        .populate("bankDetail")
        .populate("address")
        .populate("deliveryPartnerCurrentLocation");

      const d = new Date();
      d.setMinutes(d.getMinutes() - 15);
      console.log(
        `deliveryPartner.deliveryPartnerCurrentLocation:${deliveryPartner.deliveryPartnerCurrentLocation}`
      );
      if (deliveryPartner.deliveryPartnerCurrentLocation) {
        if (
          new Date(deliveryPartner.deliveryPartnerCurrentLocation.updatedAt) > d
        ) {
          const deliveryPartnerCurrentLocation =
            await DeliveryPartnerCurrentLocation.findById(
              deliveryPartner.deliveryPartnerCurrentLocation._id
            );
          deliveryPartnerCurrentLocation.online = false;
          await deliveryPartnerCurrentLocation.save();
          try {
            var start = new Date();
            start.setHours(0, 0, 0, 0);
            var end = new Date();
            end.setHours(23, 59, 59, 999);
            const deliveryPartnerLogCheck = await DeliveryPartnerLog.findOne({
              loginDate: { $gte: start, $lt: end },
            });
            if (deliveryPartnerLogCheck) {
              const deliveryPartnerLogTime =
                await DeliveryPartnerLogTime.findById(
                  deliveryPartnerLogCheck.loginData[
                    deliveryPartnerLogCheck.loginData.length - 1
                  ]
                );
              deliveryPartnerLogTime.endTime = new Date(
                deliveryPartnerCurrentLocation.updatedAt
              );
              await deliveryPartnerLogTime.save();
            }
          } catch (error) {}
        }
      }
      console.log(`delivery partner :${deliveryPartner}`);
      if (!deliveryPartner) {
        return next(new AppError("User not found", 404));
      } else if (deliveryPartner.status === "suspended") {
        return next(new AppError("User suspended", 401));
      } else {
        req.deliveryPartner = deliveryPartner;

        next();
      }
    }
  } else {
    return next(new AppError("invalid token", 401));
  }
});

exports.checkEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const owner = await DeliveryPartner.findOne({ email: email });
  if (owner) {
    res.status(200).json({ newEmail: false });
  } else {
    res.status(200).json({ newEmail: true });
  }
});

exports.checkNetwork = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "You are connected",
  });
});
