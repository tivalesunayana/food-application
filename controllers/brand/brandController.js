const Brand = require("../../models/brandModel");
const catchAsync = require("../../utils/catchAsync");
const appError = require("../../utils/appError");
const { uploadImg, deleteFile } = require("../../config/s3config");

exports.createBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.create({ title: req.body.title });
  res.status(200).json({
    brand,
    status: "success",
    message: "brand created successfully",
  });
});

exports.brandDelete = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const category = await Brand.findByIdAndDelete(id);
  res.status(200).json({
    data: category,
    status: "success",
    message: "successfully",
  });
});

exports.uploadBrandImage = catchAsync(async (req, res, next) => {
  const image = req.file;
  const response = await uploadImg(image);
  const brand = await Brand.findById(req.params.brandId);
  if (brand.image) {
    await deleteFile(brand.image);
  }
  brand.image = response.Key;
  await brand.save();
  res.status(200).json({
    brand,
    status: "success",
    message: "brand image uploaded successfully",
  });
});

exports.allBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.find();
  res.status(200).json({
    brand,
    status: "success",
    message: "successfully",
  });
});

exports.brand = catchAsync(async (req, res, next) => {
  const brand = await Brand.find({ visible: true });
  res.status(200).json({
    data: brand,
    status: "success",
    message: "successfully",
  });
});

exports.updateBrandVisible = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.brandId,
    { visible: req.body.visible },
    { new: true }
  );
  res.status(200).json({
    data: brand,
    status: "success",
    message: "brand updated successfully",
  });
});
