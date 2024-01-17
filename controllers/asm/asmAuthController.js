const ASM = require("../../models/asm/asmModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");

const { verifyFirebaseToken } = require("./../../config/firebase");
const { uploadImg } = require("../../config/s3config");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (asm) => {
  return (token = signToken(asm._id));
};

exports.dashboard = catchAsync(async (req, res, next) => {
  const asm = await req.asm;
  res.status(200).json({
    status: "success",
    message: "Successfully",
    data: asm,
  });
});
exports.updateLocation = catchAsync(async (req, res, next) => {
  const asm = req.asm;
  const { latitude, longitude } = req.body;
  asm.location = { type: "Point", coordinates: [longitude, latitude] };
  await asm.save();
  res.status(200).json({
    status: "success",
    message: "Successfully",
    data: asm,
  });
});
exports.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, notificationToken } = req.body;
  console.log(`auth token :${authToken}`);
  console.log(`notificationToken token :${notificationToken}`);

  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const asm = await ASM.findOne({
        phone: tokenValue.phone_number,
      });
      if (asm) {
        const token = await createSendToken(asm);

        if (notificationToken) {
          asm.notificationToken = notificationToken;
          await asm.save();
        } else {
        }
        res.status(200).json({
          status: "success",
          message: "successFully",
          data: asm,
          token,
        });
      } else {
        return next(new AppError("asm not found Kindly create asm", 404));
      }
    } else {
      return next(new AppError("Invalid Token ", 409));
    }
  }
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
      const asm = await ASM.findById(decoded.id);

      if (!asm) {
        return next(new AppError("User not found", 404));
      } else if (asm.status === "suspended") {
        return next(new AppError("User suspended", 401));
      } else {
        req.asm = asm;

        next();
      }
    }
  } else {
    return next(new AppError("invalid token", 401));
  }
});

exports.getAppVersion = catchAsync(async (req, res, next) => {
  const version = "1.0.0";
  res
    .status(200)
    .json({ status: "success", message: "Successfully", data: version });
});

exports.uploadPhoto = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }
  const response = await uploadImg(file);

  req.asm.photo = response.Key;
  await req.asm.save();
  res.status(200).json({
    status: "success",
    message: "profile photo upload successfully",
  });
});
