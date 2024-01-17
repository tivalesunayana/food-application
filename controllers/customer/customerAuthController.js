require("dotenv").config();
const Customer = require("../../models/customer/customerModel");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const jwt = require("jsonwebtoken");
const { verifyFirebaseToken } = require("./../../config/firebase");
const Address = require("../../models/address/addressModel");
const { uploadImg, deleteFile } = require("../../config/s3config");
const Version = require("../../models/versionModel");
// const Cart = require("../../models/cart/cartModel");

exports.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, notificationToken } = req.body;
  // console.log(req.body);
  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const customer = await Customer.findOne({
        phone: tokenValue.phone_number,
      });
      // console.log(customer);
      if (customer) {
        const token = await createSendToken(customer);

        if (notificationToken) {
          customer.notificationToken = notificationToken;
        } else {
        }
        if (customer.status === "deleted") {
          customer.status = "active";
        } else {
        }
        await customer.save();
        res.status(200).json({
          status: "success",
          message: "successFully",
          customer,
          token,
        });
      } else {
        return next(new AppError("Not found", 404));
      }
    } else {
      return next(new AppError("Invalid Token ", 409));
    }
  }
});

exports.signupWithGoogle = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const { authToken, notificationToken } = req.body;

  const latitude = req.body.latitude * 1;
  const longitude = req.body.longitude * 1;

  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      const customer = await Customer.findOne({
        phone: tokenValue.phone_number,
      });
      // console.log("Customer", customer);
      if (customer) {
        if (notificationToken) {
          customer.notificationToken = notificationToken;
        } else {
        }
        if (customer.status === "deleted") {
          customer.status = "active";
        } else {
        }
        customer.currentLocation = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
        await customer.save();

        const token = createSendToken(customer);
        res.status(200).json({
          status: "success",
          message: "successFully",
          customer,
          token,
        });
      } else {
        const newCustomer = await Customer.create({
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          phone: tokenValue.phone_number,
          notificationToken,
        });
        const token = createSendToken(newCustomer);
        // await Cart.create({ customer: newCustomer._id });
        res.status(200).json({
          status: "success",
          message: "Customer create successfully",
          customer: newCustomer,
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
const createSendToken = (customer) => {
  return (token = signToken(customer._id));
};
exports.getAppVersion = catchAsync(async (req, res, next) => {
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.customerAndroidVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
  // const version = "1.1.4";
});
exports.getIosVersion = catchAsync(async (req, res, next) => {
  // const version = "1.0.6";
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.customerIosVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
});

exports.dashboard = catchAsync(async (req, res, next) => {
  const customer = await req.customer;
  if (req.body.latitude && req.body.longitude) {
    const latitude = req.body.latitude * 1;
    const longitude = req.body.longitude * 1;
    customer.currentLocation = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    await customer.save();
  }

  res
    .status(200)
    .json({ status: "success", message: "Successfully", customer });
});

exports.deletedAccount = catchAsync(async (req, res, next) => {
  const customer = await req.customer;
  customer.status = "deleted";
  await customer.save();
  res.status(200).json({ status: "success", message: "Deleted successfully" });
});

exports.protect = catchAsync(async (req, res, next) => {
  // console.log(req.headers.authorization);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`cutomer token :${token}`);
    if (!token) {
      return next(
        new AppError("you are not logged in ! please log in to get access", 401)
      );
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const customer = await Customer.findById(decoded.id).populate({
        path: "addresses",
      });
      if (!customer) {
        return next(new AppError("Not found", 404));
      } else {
        if (customer.status === "deleted") {
          res
            .status(401)
            .json({ message: "Account deleted", status: "unauthorized" });
        } else if (customer.status === "suspended") {
          res
            .status(401)
            .json({ message: "Account suspended", status: "unauthorized" });
        } else {
          req.customer = customer;
          next();
        }
      }
    }
  } else {
    return next(new AppError("invalid token", 401));
  }
});

exports.createAddress = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer._id);
  const {
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    longitude,
    latitude,
    pinCode,
  } = req.body;

  await Address.updateMany(
    { _id: { $in: customer.addresses }, deleted: false },
    {
      defaultAddress: false,
    }
  );

  const address = await Address.create({
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    pinCode,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });
  customer.addresses.push(address._id);
  await customer.save();

  res.status(200).json({
    status: "success",
    message: "Address Added successfully",
    address,
  });
});

exports.getAllAddress = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer._id);
  const addresses = await Address.find({
    _id: { $in: customer.addresses },
    deleted: false,
  }).sort({
    _id: -1,
  });
  res.status(200).json({
    status: "success",
    message: "successfully",
    addresses,
  });
});

exports.setDefaultAddress = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer._id);

  await Address.updateMany(
    { _id: { $in: customer.addresses }, deleted: false },
    {
      defaultAddress: false,
    }
  );
  await Address.findByIdAndUpdate(req.query.addressId, {
    defaultAddress: true,
  });
  res.status(200).json({
    status: "success",
    message: "successfully",
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer._id);

  await Address.findByIdAndUpdate(req.query.addressId, { deleted: true });
  customer.addresses.pull(req.query.addressId);
  const oldAddress = await Address.find({
    _id: { $in: customer.addresses },
    defaultAddress: true,
  });
  if (oldAddress.length === 0) {
    if (!(customer.addresses.length === 0)) {
      await Address.findByIdAndUpdate(customer.addresses[0], {
        defaultAddress: true,
      });
    }
  }
  await customer.save();
  res.status(200).json({
    status: "success",
    message: "deleted successfully ",
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer._id);
  const {
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    longitude,
    latitude,
    pinCode,
  } = req.body;
  const { addressId } = req.query;

  await Address.findByIdAndUpdate(addressId, { deleted: true });
  customer.addresses.pull(addressId);
  await Address.updateMany(
    { _id: { $in: customer.addresses }, deleted: false },
    {
      defaultAddress: false,
    }
  );

  const address = await Address.create({
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    pinCode,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });
  customer.addresses.push(address._id);
  await customer.save();

  res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    address,
  });
});

exports.getSingleAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.query.addressId);
  res.status(200).json({
    status: "success",
    message: "successfully",
    address,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, dob, gender } = req.body;
  const customer = req.customer;
  if (name) {
    customer.name = name;
  }
  if (email) {
    customer.email = email;
  }
  if (dob) {
    customer.dob = new Date(dob);
  }
  if (gender) {
    customer.gender = gender;
  }
  await customer.save();
  res
    .status(200)
    .json({ status: "success", message: "Profile updated successfully" });
});

exports.updateProfilePhoto = catchAsync(async (req, res, next) => {
  const file = req.file;
  const customer = req.customer;
  const response = await uploadImg(file);
  if (customer.profileImage) {
    deleteFile(customer.profileImage);
  }
  customer.profileImage = response.Key;
  await customer.save();
  res
    .status(200)
    .json({ status: "success", message: "Profile photo updated successfully" });
});
