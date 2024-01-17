const AddOn = require("./../../models/menuItem/addOnModel");
const AddOnItem = require("./../../models/menuItem/addOnItemModel");
const catchAsync = require("../../utils/catchAsync");
exports.getAddOns = catchAsync(async (req, res, next) => {
  const addOns = await AddOn.find({
    restaurant: req.query.restaurantId,
  }).populate("addOnItems");
  res
    .status(200)
    .json({ status: "success", message: "successfully", data: addOns });
});

exports.updateAddOnItems = catchAsync(async (req, res, next) => {
  const { addOnItemId } = req.query;
  const { available } = req.body;
  await AddOnItem.findByIdAndUpdate(addOnItemId, {
    available,
  });
  res.status(200).json({
    status: "success",
    message: "addOnItem item updated successfully",
    //   data: addOnItem,
  });
});
