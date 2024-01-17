const catchAsync = require("../../utils/catchAsync");
const Owner = require("./../../models/restaurant/ownerModel");

exports.createOwner = catchAsync(async (req, res, next) => {
  const { name, email, gender, phone } = req.body;
  const owner = await Owner.create({ name, email, gender, phone });
  res
    .status(200)
    .json({ owner, status: "success", message: "owner created successfully" });
});
exports.getOwner = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const owner = await Owner.find()
    .populate("restaurant")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Owner.count();
  res
    .status(200)
    .json({ owner, total, status: "success", message: "successfully" });
});

exports.getSingleOwner = catchAsync(async (req, res, next) => {
  const { ownerId } = req.query;

  const owner = await Owner.findById(ownerId).populate("restaurant");

  res.status(200).json({ owner, status: "success", message: "successfully" });
});
exports.searchOwnerPartner = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Owner.find({
    name: { $regex: new RegExp(query, "i") },
  }).limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.deleteOwner = catchAsync(async (req, res, next) => {
  const { ownerId } = req.query;
  const owner = await Owner.findById(ownerId);
  if (owner.restaurant.length === 0) {
    await Owner.findByIdAndDelete(ownerId);
    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "First delete restaurant ",
    });
  }
});

exports.editOwner = catchAsync(async (req, res, next) => {
  const { name, email, gender, phone } = req.body;
  const { ownerId } = req.query;
  const owner = await Owner.findById(ownerId);
  if (name) {
    owner.name = name;
  }
  if (email) {
    owner.email = email;
  }
  if (gender) {
    owner.gender = gender;
  }
  if (phone) {
    owner.phone = phone;
  }
  await owner.save();
  res
    .status(200)
    .json({ owner, status: "success", message: "owner updated successfully" });
});
