const { uploadImg, deleteFile } = require("../../config/s3config");
const catchAsync = require("../../utils/catchAsync");
const AdminPromotionBanner = require("./../../models/admin/adminPromotionBannerModel");

exports.createPromotionBanner = catchAsync(async (req, res, next) => {
  const { bannerName } = req.body;

  const promotionBanner = await AdminPromotionBanner.create({
    bannerName,
  });
  res.status(200).json({
    promotionBanner,
    status: "success",
    message: "promotion banner created successfully",
  });
});
exports.getPromotionBanner = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const promotionBanner = await AdminPromotionBanner.find()
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);
  const total = await AdminPromotionBanner.count();
  res.status(200).json({
    data: promotionBanner,
    total,
    status: "success",
    message: "successfully",
  });
});

exports.uploadPromotionBanner = catchAsync(async (req, res, next) => {
  const { promotionBannerId } = req.query;
  const file = req.file;
  const response = await uploadImg(file);

  const promotionBanner = await AdminPromotionBanner.findById(
    promotionBannerId
  );
  if (promotionBanner.bannerImage) {
    await deleteFile(promotionBanner.bannerImage);
  }
  promotionBanner.bannerImage = response.Key;
  await promotionBanner.save();
  res.status(200).json({
    promotionBanner,
    status: "success",
    message: "promotion banner upload successfully",
  });
});

exports.visiblePromotionBanner = catchAsync(async (req, res, next) => {
  const { promotionBannerId } = req.query;
  const { visible } = req.body;
  const promotionBanner = await AdminPromotionBanner.findById(
    promotionBannerId
  );
  promotionBanner.visible = visible;
  await promotionBanner.save();
  res.status(200).json({
    promotionBanner,
    status: "success",
    message: "promotion banner updated successfully",
  });
});

exports.deletePromotionBanner = catchAsync(async (req, res, next) => {
  const { promotionBannerId } = req.query;
  await AdminPromotionBanner.findByIdAndDelete(promotionBannerId);
  res.status(200).json({
    status: "success",
    message: "promotion banner deleted successfully",
  });
});
