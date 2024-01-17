const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const referrals = require("../../../models/referralRewards/customerReferralModel");

exports.getAllReferrals = catchAsync(async (req, res, next) => {
  try {
    const data = await referrals.find();
    res.status(200).json({
      message: "All Referrals",
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});
