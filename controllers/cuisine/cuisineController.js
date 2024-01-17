const Cuisine = require("../../models/menuItem/cuisineModel");
const catchAsync = require("../../utils/catchAsync");

exports.createCuisine = catchAsync(async (req, res, next) => {
  const cuisine = await Cuisine.create({ title: req.body.title });
  res.status(200).json({
    cuisine,
    status: "success",
    message: "cuisine created successfully",
  });
});

exports.allCuisine = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const cuisine = await Cuisine.find()
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Cuisine.count();
  res
    .status(200)
    .json({ cuisine, total, status: "success", message: "successfully" });
});

exports.cuisine = catchAsync(async (req, res, next) => {
  const cuisine = await Cuisine.find({ visible: true });
  res.status(200).json({
    data: cuisine,
    status: "success",
    message: "successfully",
  });
});

exports.updateCuisineVisible = catchAsync(async (req, res, next) => {
  const cuisine = await Cuisine.findByIdAndUpdate(
    req.params.cuisineId,
    { visible: req.body.visible },
    { new: true }
  );
  res.status(200).json({
    cuisine,
    status: "success",
    message: "Cuisine updated successfully",
  });
});
