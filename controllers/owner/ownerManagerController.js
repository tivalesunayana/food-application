const Restaurant = require("../../models/restaurant/restaurantModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Manager = require("./../../models/restaurant/managerModel");

exports.createManager = catchAsync(async (req, res, next) => {
  const { name, email, gender, restaurant, phone } = req.body;
  if (!(name && email && gender && restaurant && phone)) {
    return next(
      new AppError(
        "name or email or gender or restaurant or phone are messing",
        404
      )
    );
  }
  const restaurantData = await Restaurant.findById(restaurant);
  if (!restaurantData) {
    return next(new AppError(" restaurant or phone are messing", 404));
  }
  const manager = await Manager.create({
    name,
    email,
    gender,
    restaurant,
    phone,
  });
  restaurantData.managers.push(manager._id);
  await restaurantData.save();
  res.status(200).json({
    manager,
    status: "success",
    message: "Manager created successfully",
  });
});

exports.removeManager = catchAsync(async (req, res, next) => {
  const { manager } = req.params;
  if (!manager) {
    return next(new AppError("manager id is missing", 404));
  }
  const managerData = await Manager.findById(manager);
  const restaurantData = await Restaurant.findById(managerData.restaurant);
  if (restaurantData) {
    // console.log(true);
  }
  restaurantData.managers.pull(managerData._id);
  await restaurantData.save();
  await Manager.findByIdAndRemove(managerData._id);
  res.status(200).json({
    status: "success",
    message: "Manager deleted successfully",
  });
});

exports.getManager = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const restaurantData = await Restaurant.findById(restaurantId);
  if (!restaurantData) {
    return next(new AppError(" restaurant or phone are messing", 404));
  }
  const manager = await Manager.find({ _id: { $in: restaurantData.managers } });
  res.status(200).json({
    data: manager,
    status: "success",
    message: "Successfully",
  });
});
