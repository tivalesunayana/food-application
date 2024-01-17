const CustomerWinCoins = require("../../models/customer/customerWinCoin");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const moment = require("moment/moment");

exports.createCustomerWinCoins = catchAsync(async (req, res, next) => {
  try {
    const { totalCoinValue } = req.body;
    const customerId = req.params.customerId;
    const customerCoin = await CustomerWinCoins.findOne({
      customer: customerId,
    });

    if (customerCoin) {
      if (customerCoin.isRedeem) {
        return next(new AppError("You can spin one time in a day only"));
      }

      let addMoreCoin = customerCoin.totalCoinValue + totalCoinValue;
      const customerCoinUpdate = await CustomerWinCoins.findOneAndUpdate(
        { customer: customerId },
        { totalCoinValue: addMoreCoin, isRedeem: true }
      );
      res
        .status(200)
        .json({ message: "Updated successfully", status: "success" });
    } else {
      const result = await CustomerWinCoins.create({
        customer: customerId,
        isRedeem: true,
        totalCoinValue,
      });
      res.status(200).json({
        message: "Created successfully",
        status: "success",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.checkForSpin = catchAsync(async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const res = await CustomerWinCoins.findOne({ customer: customerId });

    if (res) {
      let updatedTime = moment(res.updatedAt).format("YYYY-MM-DD");
      let currentTime = moment().format("YYYY-MM-DD");

      if (updatedTime === currentTime) {
        return next(new AppError("You have already spin today"));
      } else {
        res.isRedeem = false;
        res.save();
        res.status(200).json({
          message: "You can Spin today",
          status: "success",
        });
      }
    } else {
      return next(new AppError("This is new customer"));
    }
  } catch (error) {
    console.log(error);
  }
});

exports.claimCoins = catchAsync(async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    console.log("claimCoins", customerId);
  } catch (error) {
    console.log(error);
  }
});

exports.deleteCustomerWinCoins = catchAsync(async (req, res, next) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return next(new AppError("Customer Id is missing ", 404));
    }
    const ress = await CustomerWinCoins.deleteOne({ customer: customerId });
    res.status(200).json({
      message: "Coins deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
