const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const generateUniqueReferralCode = require("../../utils/generateUniqueReferralCode");

const referrals = require("../../models/referralRewards/customerReferralModel");
const Customer = require("../../models/customer/customerModel");

exports.addReferredUser = catchAsync(async (req, res, next) => {
  try {
    const customerId = req.customer._id;
    const { referralCode } = req.body;
    console.log("from token  ", req.customer._id);
    console.log("stop here for token");

    const currentCustomer = await referrals.findOne({
      customer: customerId,
    });
    const customerReferralCode = generateUniqueReferralCode();
    const referedCustomer = await referrals.findOne({
      referralCode: referralCode,
    });
    let userReferralCode = customerReferralCode;

    console.log(currentCustomer);
    if (!referedCustomer) {
      console.log("Refered Customer not found");

      return next(new AppError("Refered Customer not found", 404));
    }
    if (currentCustomer) {
      if (currentCustomer.referralCode === referralCode) {
        console.log("You can't use your referral code");

        return next(new AppError("You can't use your referral code", 404));
      }
      if (currentCustomer.isUsedReferralCode) {
        return next(new AppError("You have already used referral code", 404));
      }

      userReferralCode = currentCustomer.referralCode;
      currentCustomer.points += 5;
      currentCustomer.isUsedReferralCode = true;

      await currentCustomer.save();
      console.log("found");

      // jisne refer kiya h code

      console.log("referedCustomer", referedCustomer.referredUsers);
      currentCustomer.customer = currentCustomer.customer.toString();
      referedCustomer.referredUsers.push(currentCustomer.customer);
      referedCustomer.points += 5;

      await referedCustomer.save();

      console.log("currentCustomer", currentCustomer._id);
    } else {
      const referral = await referrals.create({
        customer: customerId,
        referralCode: customerReferralCode,

        isUsedReferralCode: true,
        points: 5,
      });
      userReferralCode = customerReferralCode;
      referedCustomer.points += 5;
      // referedCustomer.isUsedReferralCode = true;
      referedCustomer.referredUsers.push(customerId);
      await referedCustomer.save();
      console.log("not found");
    }

    console.log(customerId, referralCode);

    res.status(200).json({
      status: "success",
      message: "Referred customer added successfully",
      referralCode: userReferralCode,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateReferralCodes = catchAsync(async (req, res, next) => {
  const customerId = req.customer._id;
  const referralCode = generateUniqueReferralCode();
  console.log("from token  ", req.customer._id);

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }

  // check if customer referral code already exists

  // if (await referrals.findOne({ customer: customerId })) {
  //   return next(new AppError("All ready have referral code", 404));
  // }

  const existingReferral = await referrals.findOne({ customer: customerId });

  if (existingReferral) {
    return res.status(200).json({
      status: "success",
      message: "Referral code already exists",
      referralCode: existingReferral.referralCode,
    });
  }

  // Use the create method to create a new Referral document
  const referral = await referrals.create({
    customer: customerId,
    referralCode: referralCode,
    // points: referredUsersCount,
  });

  res.status(200).json({
    status: "success",
    message: "Referral code generated successfully",
    referralCode: referralCode,
    // points: referredUsersCount,
  });
});

exports.getSingleCustomerReferralRecord = catchAsync(async (req, res, next) => {
  try {
    const customerId = req.customer._id;
    if (!customerId) {
      return next(new AppError("No record found.", 404));
    }
    let result = {};
    result = await referrals.findOne({ customer: customerId });
    console.log("result ", result);
    if (!result) {
      result = {
        referralCode: "",
        points: 0,
        isUsedReferralCode: false,
      };
    }
    console.log("result aa ", result);
    res.status(200).json({
      message: "Customer Record ",
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});
