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
  const { page, limit } = req.query;
  const skip = page * limit - limit;

  const owner = await Owner.find()

    .limit(limit || 10)
    .skip(skip)
    .sort({ _id: -1 });

  const total = await Owner.count();
  res
    .status(200)
    .json({ data: owner, total, status: "success", message: "successfully" });
});

exports.checkEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const owner = await Owner.findOne({ email: email });
  if (owner) {
    res.status(200).json({ newEmail: false });
  } else {
    res.status(200).json({ newEmail: true });
  }
});
