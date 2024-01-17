const catchAsync = require("../../utils/catchAsync");
const redeem = require("../../models/referralRewards/redeemRewardModel");
const AppError = require("../../utils/appError");
const { uploadImg } = require("../../config/s3config");
const RewardHistory = require("../../models/referralRewards/RewardHistoryModel");
const customer = require("../../models/customer/customerModel");
const referrals = require("../../models/referralRewards/redeemRewardModel");

exports.createReward = catchAsync(async (req, res, next) => {
  try {
    const { points, image, name, rewardCount, description } = req.body;
    if (!points) {
      return next(new AppError("Please provide points"));
    }
    const result = await redeem.create({
      points,
      image,
      name,
      rewardCount,
      description,
    });
    res.status(200).json({
      message: "Reward created successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.uploadRewardImage = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const { rewardId } = req.query;
    const reward = await redeem.findById(rewardId);
    if (!reward) {
      return next(new AppError("Reward not found"));
    }
    console.log(file);
    const response = await uploadImg(file);

    reward.image = response.Key;
    await reward.save();
    res.status(200).json({
      message: "Reward image uploaded successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.deleteReward = catchAsync(async (req, res, next) => {
  try {
    const { rewardId } = req.params;
    if (!rewardId) {
      return next(new AppError("Reward id not provided"));
    }

    const result = await redeem.findByIdAndDelete(rewardId);
    res.status(200).json({
      message: "Reward deleted successfully",
      status: "success",
    });

    console.log("deleteReward");
  } catch (error) {
    console.log(error);
  }
});

exports.editReward = catchAsync(async (req, res, next) => {
  try {
    const { points, image, name, rewardCount, description } = req.body;
    const { rewardId } = req.params;

    const result = await redeem.findById(rewardId);

    if (!result) {
      return next(new AppError("Couldn't find reward"));
    }

    if (points) {
      result.points = points;
    }
    // if (image) {
    //   result.image = image;
    // }
    if (name) {
      result.name = name;
    }
    if (rewardCount) {
      result.rewardCount = rewardCount;
    }
    if (description) {
      result.description = description;
    }

    await result.save();
    res.status(200).json({
      message: "Reward edited successfully",
      status: "success",
      data: result,
    });
    console.log("EditReward");
  } catch (error) {
    console.log(error);
  }
});

exports.getRedeemReward = catchAsync(async (req, res, next) => {
  try {
    const allRedeemRwards = await redeem.find();
    res.status(200).json({
      allRedeemRwards,
      message: "All Redeem rewards",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getCustomerRewardedHistory = catchAsync(async (req, res, next) => {
  try {
    const rewardHistory = await RewardHistory.find()
      .populate({
        path: "redeemedReward",
        model: "Redeem",
      })
      .populate({ path: "rewardedCustomer", model: "referrals" });
    res.status(200).json({
      data: rewardHistory,
      status: "success",
      message: "All rewarded history",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.updateDeliveryStatus = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await RewardHistory.findById(id);
    console.log("sdjvsn", result);
    console.log(id);
    if (!result) {
      return next(new AppError("Reward history is not present"));
    }

    result.deliveryStatus = "Delivered";

    await result.save();
    res.status(200).json({
      status: "success",
      message: "Delivery status updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.deleteRewardHistory = catchAsync(async (req, res, next) => {
  try {
    const result = await RewardHistory.deleteMany();
    res.status(200).json({
      message: "Deleted customer reward history successfully",
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});
