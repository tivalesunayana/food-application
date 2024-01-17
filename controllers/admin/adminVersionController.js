const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Version = require("../../models/versionModel");
exports.getVersions = catchAsync(async (req, res, next) => {
  const version = await Version.findOne();
  if (version) {
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: version });
  } else {
    const newVersion = await Version.create({
      customerAndroidVersion: "1.1.4",
      customerIosVersion: "1.0.6",
      rpAndroidVersion: "2.0.5",
      rpIosVersion: "1.0.1",
      dpAndroidVersion: "1.0.4",
      dpIosVersion: "1.0.1",
    });
    res
      .status(200)
      .json({ status: "success", message: "successfully", data: newVersion });
  }
});
exports.editVersions = catchAsync(async (req, res, next) => {
  const {
    customerAndroidVersion,
    customerIosVersion,
    rpAndroidVersion,
    rpIosVersion,
    dpAndroidVersion,
    dpIosVersion,
  } = req.body;
  const version = await Version.findOneAndUpdate(
    {},
    {
      customerAndroidVersion,
      customerIosVersion,
      rpAndroidVersion,
      rpIosVersion,
      dpAndroidVersion,
      dpIosVersion,
    }
  );
  res.status(200).json({
    status: "success",
    message: "successfully updated",
    data: version,
  });
});
