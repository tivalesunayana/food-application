const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");
const Document = require("../../models/document/documentModel");
const { uploadImg, deleteFile } = require("../../config/s3config");
const BankDetail = require("../../models/payment/bankDetailModel");
const Address = require("../../models/address/addressModel");
const AppError = require("../../utils/appError");
const { mongoose } = require("mongoose");

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const {
    brand_display_name,

    outlet_name,
    address,
    landmark,
    area,
    state,
    pincode,
    city,
    business_contact,
    merchant_number,
    email,

    cuisines,
    longitude,
    latitude,
  } = req.body;
  if (!(longitude && latitude)) {
    return next(
      new AppError("name  or longitude or latitude are messing", 404)
    );
  }
  const restaurant = await Restaurant.create({
    brand_display_name,
    owner_name: req.owner.name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    pincode,
    city,
    business_contact,
    merchant_number,
    email,
    cuisines,
    location: { type: "Point", coordinates: [longitude, latitude] },
    owner: req.owner._id,
    petPooja: false,
    approved: false,
    appVisible: false,
  });
  restaurant.outlet_id = restaurant._id.toString();
  await restaurant.save();
  req.owner.restaurant.push(restaurant._id);
  await req.owner.save();
  res.status(200).json({
    restaurant,
    status: "success",
    message: "Restaurant created successfully",
  });
});

exports.createAndUploadFssai = catchAsync(async (req, res, next) => {
  const { restaurantId, fssai_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!fssai_no) {
    return new AppError("No fssai_no found", 404);
  }
  restaurant.fssai_no = fssai_no;
  restaurant.fssai_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "fssai upload successfully" });
});
exports.createAndUploadGst = catchAsync(async (req, res, next) => {
  const { restaurantId, gst_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!gst_no) {
    return new AppError("No gst_no found", 404);
  }
  restaurant.gst_no = gst_no;
  restaurant.gst_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "gst upload successfully" });
});

exports.createAndUploadPan = catchAsync(async (req, res, next) => {
  const { restaurantId, pan_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!pan_no) {
    return new AppError("No pan_no found", 404);
  }
  restaurant.pan_no = pan_no;
  restaurant.pan_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "pan upload successfully" });
});

exports.createAndUploadAadhar = catchAsync(async (req, res, next) => {
  const { restaurantId, aadhar_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!aadhar_no) {
    return new AppError("No aadhar_no found", 404);
  }
  restaurant.aadhar_no = aadhar_no;
  restaurant.aadhar_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "aadhar upload successfully" });
});
exports.uploadRestaurantLogo = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }
  const restaurant = await Restaurant.findById(req.query.restaurantId);
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  const response = await uploadImg(file);

  restaurant.restaurant_logo = response.Key;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant logo uploaded successfully",
  });
});
exports.addTiming = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const checkTiming = await RestaurantTiming.findOne({
    restaurant: restaurant._id,
  });
  if (checkTiming) {
    if (sunday) {
      checkTiming.sunday = sunday;
    }
    if (monday) {
      checkTiming.monday = monday;
    }
    if (tuesday) {
      checkTiming.tuesday = tuesday;
    }
    if (wednesday) {
      checkTiming.wednesday = wednesday;
    }
    if (thursday) {
      checkTiming.thursday = thursday;
    }
    if (friday) {
      checkTiming.friday = friday;
    }
    if (saturday) {
      checkTiming.saturday = saturday;
    }
    await checkTiming.save();
  } else {
    const createTiming = await RestaurantTiming.create({
      restaurant: restaurant._id,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
    restaurant.timing = createTiming._id;
    await restaurant.save();
  }
  res
    .status(200)
    .json({ status: "success", message: "timing created successfully" });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.find({
    owner: req.owner._id,
  }).populate("bankDetail");
  res.status(200).json({
    restaurant,
    status: "success",
    message: " successfully",
  });
});

exports.addBankDetail = catchAsync(async (req, res, next) => {
  const { bankName, accountNumber, ifscCode, branch, accountHolderName } =
    req.body;
  const { restaurantId } = req.query;
  if (
    !(
      bankName &&
      accountNumber &&
      ifscCode &&
      restaurantId &&
      branch &&
      accountHolderName
    )
  ) {
    return next(
      new AppError(
        "bankName,accountNumber,ifscCode, restaurant is missing",
        404
      )
    );
  }
  const restaurant = await Restaurant.findById(restaurantId);

  const bankDetail = await BankDetail.create({
    bankName,
    accountNumber,
    ifscCode,
    branch,
    accountHolderName,
  });
  restaurant.bankDetail = bankDetail._id;
  await restaurant.save();
  res.status(200).json({
    bankDetail,
    status: "success",
    message: "Restaurant BankDetail created successfully",
  });
});

exports.updateContactDetails = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { owner_name, business_contact } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.owner_name = owner_name;
  restaurant.business_contact = business_contact;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant Contact Details",
  });
});

exports.updateTime = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { res_timings } = req.body;
  if (!(res_timings.length === 7)) {
    return next(new AppError("res_timings length is invalid", 404));
  }
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.res_timings = res_timings;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant timing updated successfully",
  });
});
