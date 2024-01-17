require("dotenv").config();
const Manager = require("../../models/restaurant/managerModel");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const jwt = require("jsonwebtoken");
const { verifyFirebaseToken } = require("./../../config/firebase");

exports.loginWithGoogle = catchAsync(async (req, res) => {
  const { authToken, notificationToken } = req.body;
  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const manager = await Manager.findOne({
        phoneNumber: tokenValue.phone_number,
      });
      if (manager) {
        const token = await createSendToken(manager);

        manager.password = undefined;
        if (notificationToken) {
          manager.notificationToken = notificationToken;
          await manager.save();
        } else {
        }
        res.status(200).json({
          status: "success",
          message: "successFully",
          manager,
          token,
        });
      } else {
        return next(new AppError("manager not found ", 404));
      }
    } else {
      return next(new AppError("Invalid Token ", 409));
    }
  }
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (manager) => {
  return (token = signToken(manager._id));
};

exports.dashboard = catchAsync(async (req, res) => {
  const manager = await req.manager;
  res.status(200).json({ status: "success", message: "Successfully", manager });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        new AppError("you are not logged in ! please log in to get access", 401)
      );
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const manager = await Manager.findById(decoded.id).populate({
        path: "restaurant",
        populate: { path: "address" },
      });
      if (!manager) {
        return next(new AppError("User not found", 404));
      } else {
        req.manager = manager;
        next();
      }
    }
  } else {
    return next(new AppError("invalid token", 401));
  }
});
