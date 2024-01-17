// const { uploadImg } = require("../../config/s3config");
// const Address = require("../../models/address/addressModel");
// const Document = require("../../models/document/documentModel");
// const BankDetail = require("../../models/payment/bankDetailModel");
// const Owner = require("../../models/restaurant/ownerModel");
// const Restaurant = require("../../models/restaurant/restaurantModel");
// const RestaurantTiming = require("../../models/restaurant/restaurantTimingModel");
// const AppError = require("../../utils/appError");
// const catchAsync = require("../../utils/catchAsync");

// exports.createRestaurant = catchAsync(async (req, res, next) => {
//   const {
//     name,
//     longitude,
//     latitude,
//     avgCost,
//     restaurantType,
//     veg,
//     nonVeg,
//     ownerId,
//   } = req.body;
//   if (!(name && longitude && latitude && ownerId)) {
//     return next(
//       new AppError("name  or longitude or latitude are messing", 404)
//     );
//   }
//   const owner = await Owner.findById(ownerId);

//   const restaurant = await Restaurant.create({
//     name: name,
//     owner: owner._id,
//     avgCost: avgCost * 1,
//     restaurantType,
//     asm: req.asm._id,
//     veg,
//     nonVeg,
//     contactPersonName: owner.name,
//     contactPersonPhone: owner.phone,
//     location: { type: "Point", coordinates: [longitude, latitude] },
//   });
//   owner.restaurant.push(restaurant._id);
//   req.asm.restaurants.push(restaurant._id);
//   await req.asm.save();
//   await owner.save();
//   res.status(200).json({
//     restaurant,
//     status: "success",
//     message: "Restaurant created successfully",
//   });
// });

// exports.uploadRestaurantImage = catchAsync(async (req, res, next) => {
//   const files = req.files;
//   if (!files) {
//     return next(new AppError("image is missing", 404));
//   }
//   const images = [];
//   const restaurant = await Restaurant.findById(req.query.restaurantId);
//   for (let index = 0; index < files.length; index++) {
//     const element = files[index];
//     const response = await uploadImg(element);
//     images.push(response.Key);
//   }
//   restaurant.images = images;
//   await restaurant.save();
//   res.status(200).json({
//     status: "success",
//     message: "Restaurant images uploaded successfully",
//   });
// });

// exports.createGstCertificate = catchAsync(async (req, res, next) => {
//   const { gstNumber } = req.body;
//   const file = req.file;
//   if (!file) {
//     return next(new AppError("image is missing", 404));
//   }
//   const response = await uploadImg(file);
//   // const expire = new Date(req.body.expire);
//   // const issueData = new Date(req.body.issueData);
//   const { restaurantId } = req.query;

//   const restaurant = await Restaurant.findById(restaurantId);

//   const document = await Document.create({
//     gstNumber,
//     restaurant: restaurant._id,
//     documentFile: response.Key,
//   });
//   restaurant.gstCertificate = document._id;
//   await restaurant.save();
//   res.status(200).json({
//     document,
//     status: "success",
//     message: "Restaurant document created successfully",
//   });
// });
// exports.createFssaiCertificate = catchAsync(async (req, res, next) => {
//   const { certificateNo } = req.body;
//   const file = req.file;
//   if (!file) {
//     return next(new AppError("image is missing", 404));
//   }
//   const response = await uploadImg(file);
//   const { restaurantId } = req.query;

//   const restaurant = await Restaurant.findById(restaurantId);

//   const document = await Document.create({
//     certificateNo,
//     restaurant: restaurant._id,
//     documentFile: response.Key,
//   });
//   restaurant.fssaiCertificate = document._id;
//   await restaurant.save();
//   res.status(200).json({
//     document,
//     status: "success",
//     message: "Restaurant document created successfully",
//   });
// });
// //
// exports.uploadMenuItemsFile = catchAsync(async (req, res, next) => {
//   const file = req.file;
//   if (!file) {
//     return next(new AppError("image is missing", 404));
//   }
//   const response = await uploadImg(file);
//   const { restaurantId } = req.query;

//   const restaurant = await Restaurant.findById(restaurantId);

//   restaurant.menuItemsFile = response.Key;
//   await restaurant.save();
//   res.status(200).json({
//     status: "success",
//     message: "Restaurant menu item file upload successfully",
//   });
// });

// exports.addBankDetail = catchAsync(async (req, res, next) => {
//   const { bankName, accountNumber, ifscCode, branch, accountHolderName } =
//     req.body;
//   const { restaurantId } = req.query;
//   if (
//     !(
//       bankName &&
//       accountNumber &&
//       ifscCode &&
//       restaurantId &&
//       branch &&
//       accountHolderName
//     )
//   ) {
//     return next(
//       new AppError(
//         "bankName,accountNumber,ifscCode, restaurant is missing",
//         404
//       )
//     );
//   }
//   const restaurant = await Restaurant.findById(restaurantId);

//   const bankDetail = await BankDetail.create({
//     bankName,
//     accountNumber,
//     ifscCode,
//     branch,
//     accountHolderName,
//   });
//   restaurant.bankDetail = bankDetail._id;
//   await restaurant.save();
//   res.status(200).json({
//     bankDetail,
//     status: "success",
//     message: "Restaurant BankDetail created successfully",
//   });
// });
// exports.getRestaurantAddress = catchAsync(async (req, res, next) => {
//   const restaurant = await Restaurant.findById(req.query.restaurantId).populate(
//     "address"
//   );
//   res.status(200).json({ data: restaurant.address });
// });

// exports.addAddress = catchAsync(async (req, res, next) => {
//   const {
//     completeAddress,
//     city,
//     state,
//     landmark,
//     pinCode,
//     longitude,
//     latitude,
//   } = req.body;
//   const { restaurantId } = req.query;
//   if (!(completeAddress && city && state && pinCode && longitude && latitude)) {
//     return next(
//       new AppError(
//         "addressType, completeAddress, city,state,  pinCode,longitude,latitude,restaurant, are missing",
//         404
//       )
//     );
//   }
//   const restaurant = await Restaurant.findById(restaurantId);

//   const address = await Address.create({
//     addressType: "Work",
//     completeAddress,
//     city,
//     state,
//     landmark,
//     pinCode,
//     location: { type: "Point", coordinates: [longitude, latitude] },
//   });
//   restaurant.location.coordinates = [longitude, latitude];
//   restaurant.address = address._id;
//   await restaurant.save();
//   res.status(200).json({
//     address,
//     status: "success",
//     message: "Restaurant Address created successfully",
//   });
// });

// exports.updateContactDetails = catchAsync(async (req, res, next) => {
//   const { restaurantId } = req.query;
//   const { contactPersonName, contactPersonPhone } = req.body;
//   const restaurant = await Restaurant.findById(restaurantId);
//   restaurant.contactPersonName = contactPersonName;
//   restaurant.contactPersonPhone = contactPersonPhone;
//   await restaurant.save();
//   res.status(200).json({
//     status: "success",
//     message: "Restaurant Contact Details",
//   });
// });

// exports.getAllRestaurants = catchAsync(async (req, res, next) => {
//   // console.log(req.owner);
//   const { restaurantId } = req.query;

//   const restaurant = await Restaurant.aggregate([
//     {
//       $match: { _id: new mongoose.Types.ObjectId(restaurantId) },
//     },
//     {
//       $lookup: {
//         from: "restaurantreviews",
//         localField: "_id",
//         foreignField: "restaurant",
//         as: "reviewCount",
//       },
//     },

//     { $addFields: { avgRating: { $avg: "$reviewCount.rating" } } },
//     { $addFields: { reviewCount: { $size: "$reviewCount" } } },
//   ]);

//   await Cuisine.populate(restaurant, { path: "cuisines" });
//   await Category.populate(restaurant, { path: "categories" });
//   await Address.populate(restaurant, { path: "address" });
//   await RestaurantTiming.populate(restaurant, { path: "timing" });
//   await BankDetail.populate(restaurant, { path: "bankDetail" });
//   // await Document.populate(restaurant, { path: "aadharCard" });
//   await Document.populate(restaurant, { path: "gstCertificate" });
//   await Document.populate(restaurant, { path: "fssaiCertificate" });
//   res
//     .status(200)
//     .json({ status: "success", message: "successfully", data: restaurant[0] });
// });

// exports.addTiming = catchAsync(async (req, res, next) => {
//   const { restaurantId } = req.query;
//   const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
//     req.body;
//   const restaurant = await Restaurant.findById(restaurantId);
//   const checkTiming = await RestaurantTiming.findOne({
//     restaurant: restaurant._id,
//   });
//   if (checkTiming) {
//     if (sunday) {
//       checkTiming.sunday = sunday;
//     }
//     if (monday) {
//       checkTiming.monday = monday;
//     }
//     if (tuesday) {
//       checkTiming.tuesday = tuesday;
//     }
//     if (wednesday) {
//       checkTiming.wednesday = wednesday;
//     }
//     if (thursday) {
//       checkTiming.thursday = thursday;
//     }
//     if (friday) {
//       checkTiming.friday = friday;
//     }
//     if (saturday) {
//       checkTiming.saturday = saturday;
//     }
//     await checkTiming.save();
//   } else {
//     const createTiming = await RestaurantTiming.create({
//       restaurant: restaurant._id,
//       sunday,
//       monday,
//       tuesday,
//       wednesday,
//       thursday,
//       friday,
//       saturday,
//     });
//     restaurant.timing = createTiming._id;
//     await restaurant.save();
//   }
//   res
//     .status(200)
//     .json({ status: "success", message: "timing created successfully" });
// });

// exports.getTiming = catchAsync(async (req, res, next) => {
//   const { restaurantId } = req.query;
//   const timing = await RestaurantTiming.findOne({
//     restaurant: restaurantId,
//   });
//   res.status(200).json({
//     status: "success",
//     message: "timing created successfully",
//     timing,
//   });
// });

// exports.getRestaurants = catchAsync(async (req, res, next) => {
//   const restaurant = await Restaurant.find({
//     _id: { $in: req.asm.restaurants },
//   })
//     .populate("gstCertificate")
//     .populate("fssaiCertificate")
//     .populate("bankDetail")
//     .populate("timing")
//     .populate("owner")
//     .populate("address");
//   res.status(200).json({
//     restaurant,
//     status: "success",
//     message: " successfully",
//   });
// });

// exports.getRestaurant = catchAsync(async (req, res, next) => {
//   const restaurant = await Restaurant.findById(req.query.restaurantId)
//     .populate("gstCertificate")
//     .populate("fssaiCertificate")
//     .populate("bankDetail")
//     .populate("timing")
//     .populate("owner")
//     .populate("address");
//   res.status(200).json({
//     restaurant,
//     status: "success",
//     message: " successfully",
//   });
// });

const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");
const Document = require("../../models/document/documentModel");
const { uploadImg, deleteFile } = require("../../config/s3config");
const BankDetail = require("../../models/payment/bankDetailModel");
const Address = require("../../models/address/addressModel");
const AppError = require("../../utils/appError");
const { mongoose } = require("mongoose");
const Owner = require("../../models/restaurant/ownerModel");
const Taxes = require("../../models/item/taxesModel");
const Attributes = require("../../models/item/attributesModel");
exports.uploadMenuItemsFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }
  const response = await uploadImg(file);
  const { restaurantId } = req.query;

  const restaurant = await Restaurant.findById(restaurantId);

  restaurant.menuItemsFile = response.Key;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant menu item file upload successfully",
  });
});
exports.createRestaurant = catchAsync(async (req, res, next) => {
  const {
    brand_display_name,
    outlet_name,
    ownerId,
    address,
    landmark,
    area,
    state,
    pincode,
    city,
    note,
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
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    new AppError("Owner id is required ", 404);
  }
  const restaurant = await Restaurant.create({
    asm: req.asm._id,
    brand_display_name,
    owner_name: owner.name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    note,
    pincode,
    city,
    business_contact,
    merchant_number,
    email,
    cuisines,
    location: { type: "Point", coordinates: [longitude, latitude] },
    owner: owner._id,
    petPooja: false,
    approved: false,
    appVisible: false,
  });
  restaurant.outlet_id = restaurant._id.toString();

  owner.restaurant.push(restaurant._id);
  await owner.save();

  const taxes = [
    { taxname: "SGST", tax: "2.5" },
    { taxname: "CGST", tax: "2.5" },
    { taxname: "SGST", tax: "9" },
    { taxname: "CGST", tax: "9" },
  ];
  for (let index = 0; index < taxes.length; index++) {
    const element = taxes[index];
    const tax = await Taxes.create({
      taxname: element.taxname,
      tax: element.tax,
      restaurant: restaurant._id,
      active: "1",
    });
    restaurant.taxes.push(tax._id);
    tax.taxid = tax._id.toString();
    await tax.save();
  }
  await restaurant.save();
  res.status(200).json({
    data: restaurant,
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
    asm: req.asm._id,
  }).populate("bankDetail");
  res.status(200).json({
    restaurant,
    status: "success",
    message: " successfully",
  });
});
exports.getSingleRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.query.restaurantId)
    .populate("bankDetail")
    .populate("taxes");
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

exports.createTax = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { taxname, tax } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  const taxData = await Taxes.create({
    taxname,
    tax,
    active: "1",
    restaurant: restaurantId,
  });
  taxData.taxid = taxData._id.toString();
  restaurant.taxes.push(taxData._id);
  await restaurant.save();
  await taxData.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant tax created successfully",
  });
});

exports.getTaxes = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const taxData = await Taxes.find({
    restaurant: restaurantId,
  });

  res.status(200).json({
    data: taxData,
    status: "success",
    message: "Restaurant taxes",
  });
});

exports.createAttribute = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { array } = req.body;

  const attributes = [];
  const restaurant = await Restaurant.findById(restaurantId);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const data = await Attributes.create({
      attribute: element.attribute,
      active: "1",
      restaurant: restaurantId,
    });
    data.attributeid = data._id.toString();
    await data.save();
    attributes.push(data._id);
  }
  restaurant.attributes = attributes;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant Attributes created successfully",
  });
});

exports.getAttributes = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const taxData = await Attributes.find({
    restaurant: restaurantId,
  });

  res.status(200).json({
    data: taxData,
    status: "success",
    message: "Restaurant Attributes",
  });
});
