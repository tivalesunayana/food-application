const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const DeliveryPartnerNotification = require("../../models/deliveryPartner/deliveryPartnerNotificationModel");

exports.getNotificationForDelivery = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = page * limit - limit;
  const deliveryNotification = await DeliveryPartnerNotification.find({
    show: true,
  })
    .sort({ _id: -1 })
    .limit(limit || 10)
    .skip(skip);

  const total = await DeliveryPartnerNotification.count({ show: true });
  res.status(200).json({
    data: deliveryNotification,
    total,
    status: "success",
    message: "successfully",
  });
});
