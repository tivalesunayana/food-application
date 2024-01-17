const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const { uploadImg, deleteFile } = require("../../config/s3config");
const Address = require("../../models/address/addressModel");
const BankDetail = require("../../models/payment/bankDetailModel");

exports.uploadDeliveryPartnerImage = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }

  const deliveryPartner = await DeliveryPartner.findById(
    req.deliveryPartner._id
  );
  if (deliveryPartner.image) {
    await deleteFile(deliveryPartner.image);
  }
  const response = await uploadImg(file);
  deliveryPartner.image = response.Key;
  await deliveryPartner.save();
  res.status(200).json({
    deliveryPartner,
    status: "success",
    message: "deliveryPartner image uploaded successfully",
  });
});
exports.uploadDeliveryPartnerDocument = catchAsync(async (req, res, next) => {
  const files = req.files;
  const document = { aadharCardFront: "", aadharCardBack: "", panCard: "" };

  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    const response = await uploadImg(element);
    if (index === 0) {
      document.aadharCardFront = response.Key;
    }
    if (index === 1) {
      document.aadharCardBack = response.Key;
    }
    if (index === 2) {
      document.panCard = response.Key;
    }
  }
  if (!files) {
    return next(new AppError("Document is missing", 404));
  }

  // const deliveryPartner = await DeliveryPartner.findById(
  //   req.deliveryPartner._id
  // );

  req.deliveryPartner.aadharCardFront = document.aadharCardFront;
  req.deliveryPartner.aadharCardBack = document.aadharCardBack;
  req.deliveryPartner.panCard = document.panCard;
  await req.deliveryPartner.save();
  res.status(200).json({
    deliveryPartner: req.deliveryPartner,
    status: "success",
    message: "deliveryPartner document uploaded successfully",
  });
});

exports.addAddress = catchAsync(async (req, res, next) => {
  const {
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    pinCode,
    longitude,
    latitude,
  } = req.body;

  if (
    !(
      addressType &&
      completeAddress &&
      city &&
      state &&
      pinCode &&
      longitude &&
      latitude
    )
  ) {
    return next(
      new AppError(
        "addressType, completeAddress, city,state,  pinCode,longitude,latitude,restaurant, are missing",
        404
      )
    );
  }
  const deliveryPartner = await DeliveryPartner.findById(
    req.deliveryPartner._id
  );

  const address = await Address.create({
    addressType,
    completeAddress,
    city,
    state,
    landmark,
    pinCode,
    location: { type: "Point", coordinates: [longitude, latitude] },
  });
  deliveryPartner.address = address._id;
  await deliveryPartner.save();
  res.status(200).json({
    deliveryPartner,
    status: "success",
    message: "deliveryPartner Address created successfully",
  });
});

exports.addBankDetail = catchAsync(async (req, res, next) => {
  const { bankName, accountNumber, ifscCode, branch, accountHolderName } =
    req.body;

  if (!(bankName && accountNumber && ifscCode && branch && accountHolderName)) {
    return next(
      new AppError("bankName,accountNumber,ifscCode, is missing", 404)
    );
  }
  const deliveryPartner = await DeliveryPartner.findById(
    req.deliveryPartner._id
  );

  const bankDetail = await BankDetail.create({
    bankName,
    accountNumber,
    ifscCode,
    branch,
    accountHolderName,
  });

  deliveryPartner.bankDetail = bankDetail._id;
  await deliveryPartner.save();
  res.status(200).json({
    bankDetail,
    status: "success",
    message: " BankDetail created successfully",
  });
});
