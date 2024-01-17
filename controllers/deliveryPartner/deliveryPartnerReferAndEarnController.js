const DeliveryPartnerReferAndEarn = require("../../models/deliveryPartner/deliveryPartnerReferAndEarnModel");
const catchAsync = require("../../utils/catchAsync");

exports.getReferAndEarnAmount = catchAsync(async (req, res, next) => {
  const referAndEarn = await DeliveryPartnerReferAndEarn.findOne();
  if (!referAndEarn) {
    const data = await DeliveryPartnerReferAndEarn.create({ amount: 50 });
    res.status(200).json({
      data,

      status: "success",
      message: "successfully",
    });
  } else {
    res.status(200).json({
      data: referAndEarn,

      status: "success",
      message: "successfully",
    });
  }
});
