const catchAsync = require("../../utils/catchAsync");
const Redeem = require("../../models/referralRewards/redeemRewardModel");
const Referrals = require("../../models/referralRewards/customerReferralModel");

const AppError = require("../../utils/appError");
const { uploadImg } = require("../../config/s3config");
const RewardHistory = require("../../models/referralRewards/RewardHistoryModel");

exports.RedeemReward = catchAsync(async (req, res, next) => {
  try {
    const customerId = req.customer._id;
    const rewardId = req.body.rewardId;
    // const deliveryStatus = req.body.deliveryStatus;

    console.log(`customerId:: ${customerId}`);
    console.log(`reward:: ${rewardId}`);

    const customer = await Referrals.findOne({ customer: customerId });
    console.log(customer);
    const reward = await Redeem.findById(rewardId);

    if (!customer || !reward) {
      return next(new AppError("User or reward not found"));
    }
    console.log(`customer points ${customer.points}`);
    console.log(`reward points ${reward.points}`);

    if (customer.points >= reward.points) {
      customer.points -= reward.points;

      reward.rewardCount += 1;
      // if (reward.points === customer.points) {
      //   customer.hasClaimedTShirt = true;
      // }
      await customer.save();
      await reward.save();

      const rewardHistory = await RewardHistory.create({
        redeemedReward: reward,
        rewardedCustomer: customer,

        // customerData: {
        //   customer: customerId,
        //   customerName: req.customer.name,
        //   customerPhone: req.customer.phone,
        // },
        customer: customerId,
        customerName: req.customer.name,
        customerPhone: req.customer.phone,
        // deliveryStatus: deliveryStatus,
      });

      console.log(`rewardHistory::${rewardHistory}`);
      await rewardHistory.save();

      res.status(200).json({
        success: true,
        message: "Reward redeemed successfully",
        data: rewardHistory,
      });
    } else {
      res.status(200).json({
        message: "insufficient points to redeem this reward",
      });
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
});

exports.getSingleCustomerRewardHistory = catchAsync(async (req, res, next) => {
  try {
    const customerId = req.customer._id;
    const result = await RewardHistory.find({ customer: customerId })
      .populate({
        path: "redeemedReward",
        model: "Redeem",
      })
      .populate({
        path: "rewardedCustomer",
        model: "referrals",
      });
    if (!result) {
      return next(new AppError("Could not find Reward"));
    }
    res.status(200).json({
      message: "Available rewards history",
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

// exports.getRewardHistoryy = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const rewardHis = await RewardHistory.find()
//     .populate("redeemReward")
//     .populate("rewardedCustomer")
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await RewardHistory.count();
//   res.status(200).json({
//     data: rewardHis,
//     total,
//     status: "success",
//     message: "successfully",
//   });
// });
