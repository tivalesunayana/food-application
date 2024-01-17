require("dotenv").config();
const Owner = require("../../models/restaurant/ownerModel");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const jwt = require("jsonwebtoken");
const { verifyFirebaseToken } = require("./../../config/firebase");

exports.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken } = req.body;
  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const owner = await Owner.findOne({
        phone: tokenValue.phone_number,
      });
      if (owner) {
        const token = await createSendToken(owner);
        res.status(200).json({
          status: "success",
          message: "successFully",
          owner,
          token,
        });
      } else {
        return next(new AppError("owner not found Kindly create owner", 404));
      }
    } else {
      return next(new AppError("Invalid Token ", 409));
    }
  }
});

exports.getAppVersion = catchAsync(async (req, res, next) => {
  const version = "2.0.5";
  res
    .status(200)
    .json({ status: "success", message: "Successfully", data: version });
});

exports.checkEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const owner = await Owner.findOne({ email: email });
  if (owner) {
    res.status(200).json({ newEmail: false });
  } else {
    res.status(200).json({ newEmail: true });
  }
});

exports.signupWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, email, gender, name } = req.body;

  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const owner = await Owner.findOne({
        phoneNumber: tokenValue.phone_number,
      });

      if (owner) {
        const token = createSendToken(owner);
        res.status(200).json({
          status: "success",
          message: "successFully",
          owner,
          token,
        });
      } else {
        const newOwner = await Owner.create({
          phone: tokenValue.phone_number,
          email,
          gender,
          name,
        });
        const token = createSendToken(newOwner);
        const cookieOptions = {
          expires: new Date(
            Date.now() +
              process.env.JWT_COOKIES_EXPIRES_IN * 24 * 62 * 62 * 1000
          ),
          httpOnly: true,
        };

        if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

        res.cookie("bearerTokenRestaurant", token, cookieOptions);
        res.status(200).json({
          status: "Created",
          message: "owner create successfully",
          owner: newOwner,
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
const createSendToken = (owner) => {
  return (token = signToken(owner._id));
};

exports.dashboard = catchAsync(async (req, res) => {
  const owner = await req.owner;
  res
    .status(200)
    .json({ status: "success", message: "Successfully", data: owner });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`owner token:${token}`)
    if (!token) {
      return next(
        new AppError("you are not logged in ! please log in to get access", 401)
      );
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const owner = await Owner.findById(decoded.id).populate({
        path: "restaurant",
        populate: { path: "address" },
      });
      if (!owner) {
        return next(new AppError("User not found", 404));
      } else {
        req.owner = owner;
        next();
      }
    }
  } else if (req.headers.cookie) {
    const value = req.headers.cookie.split("bearerTokenRestaurant=")[1];
    token = value.split(";")[0];
    // console.log(req.headers.cookie);

    // console.log(token);
    if (!token) {
      res.status(401).json({
        status: "unauthorized",
        message: "you are not logged in ! please log in to get access",
      });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const owner = await Owner.findById(decoded.id).populate("restaurant");

      if (owner) {
        // console.log(req.body);
        req.owner = owner;
        next();
      } else {
        return next(new AppError("user not Found ", 404));
      }
    }
  } else {
    return next(new AppError("invalid token", 401));
  }
});
