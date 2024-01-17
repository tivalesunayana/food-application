const DeliveryPartner = require("../../models/deliveryPartner/deliveryPartner");
const DeliveryPartnerVehicle = require("../../models/deliveryPartner/deliveryPartnerVehicleModel");

const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/appError");
const { uploadImg } = require("../../config/s3config");

exports.uploadDeliveryPartnerVehicleDocument = catchAsync(
  async (req, res, next) => {
    const files = req.files;
    const document = {
      drivingLicenseFront: "",
      drivingLicenseBack: "",
      vehicleInsurance: "",
      psu: "",
      rc: "",
    };
    const deliveryPartnerVehicle = await DeliveryPartnerVehicle.findById(
      req.deliveryPartner.vehicle
    );
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const response = await uploadImg(element);
      if (index === 0) {
        document.drivingLicenseFront = response.Key;
      }
      if (index === 1) {
        document.drivingLicenseBack = response.Key;
      }
      if (index === 2) {
        document.vehicleInsurance = response.Key;
      }
      if (index === 3) {
        document.psu = response.Key;
      }
      if (index === 4) {
        document.rc = response.Key;
      }
    }
    if (!files) {
      return next(new AppError("Document is missing", 404));
    }

    deliveryPartnerVehicle.drivingLicenseFront = document.drivingLicenseFront;
    deliveryPartnerVehicle.drivingLicenseBack = document.drivingLicenseBack;
    deliveryPartnerVehicle.vehicleInsurance = document.vehicleInsurance;
    deliveryPartnerVehicle.psu = document.psu;
    deliveryPartnerVehicle.rc = document.rc;
    await deliveryPartnerVehicle.save();
    res.status(200).json({
      status: "success",
      message: "deliveryPartnerVehicle document uploaded successfully",
    });
  }
);
exports.createDeliveryPartnerVehicle = catchAsync(async (req, res, next) => {
  const { vehicleType, vehicleName, vehicleAge, vehicleNumber } = req.body;

  const vehicle = await DeliveryPartnerVehicle.create(
    vehicleType === "Cycle"
      ? { vehicleType, deliveryPartner: req.deliveryPartner._id }
      : {
          vehicleType,
          vehicleName,
          vehicleAge,
          vehicleNumber,
          deliveryPartner: req.deliveryPartner._id,
        }
  );
  req.deliveryPartner.vehicle = vehicle._id;
  await req.deliveryPartner.save();
  res.status(200).json({
    status: "success",
    message: "Vehicle created successfully",
    data: vehicle,
  });
});
