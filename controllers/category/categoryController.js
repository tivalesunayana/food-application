const AppCategory = require("../../models/appCategoryModel");
const catchAsync = require("../../utils/catchAsync");
const appError = require("../../utils/appError");
const { uploadImg, deleteFile } = require("../../config/s3config");

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await AppCategory.create({ title: req.body.title });
  res.status(200).json({
    category,
    status: "success",
    message: "Category created successfully",
  });
});

exports.uploadCategoryImage = catchAsync(async (req, res, next) => {
  const image = req.file;
  const response = await uploadImg(image);
  const category = await AppCategory.findById(req.params.categoryId);
  if (category.image) {
    await deleteFile(category.image);
  }
  category.image = response.Key;
  await category.save();
  res.status(200).json({
    category,
    status: "success",
    message: "Category image uploaded successfully",
  });
});

exports.allCategory = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const category = await AppCategory.find()
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await AppCategory.count();
  res
    .status(200)
    .json({ category, total, status: "success", message: "successfully" });
});

exports.category = catchAsync(async (req, res, next) => {
  const category = await AppCategory.find({ visible: true });
  res.status(200).json({
    data: category,
    status: "success",
    message: "successfully",
  });
});

exports.categoryDelete = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const category = await AppCategory.findByIdAndDelete(id);
  res.status(200).json({
    data: category,
    status: "success",
    message: "successfully",
  });
});

exports.updateCategoryVisible = catchAsync(async (req, res, next) => {
  const category = await AppCategory.findByIdAndUpdate(
    req.params.categoryId,
    { visible: req.body.visible },
    { new: true }
  );
  res.status(200).json({
    category,
    status: "success",
    message: "Category updated successfully",
  });
});
