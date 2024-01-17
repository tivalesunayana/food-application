const redeem = require("../../models/referralRewards/redeemRewardModel");
const catchAsync = require("../../utils/catchAsync");

exports.getAvailableRewards = catchAsync(async (req, res, next) => {
  try {
    const rewards = await redeem.find();
    res.status(200).json({
      message: "All rewards ",
      status: "success",
      rewards: rewards,
    });
  } catch (error) {
    console.log(error);
  }
});
