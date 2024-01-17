const catchAsync = require("../../utils/catchAsync");
const DeliveryPartnerTicket = require("../../models/deliveryPartner/deliveryPartnerTicketModel");
exports.createTicket = catchAsync(async (req, res, next) => {
  const { topic, description } = req.body;
  const count = await DeliveryPartnerTicket.count();
  const ticket = await DeliveryPartnerTicket.create({
    topic,
    description,
    deliveryPartner: req.deliveryPartner._id,
    ticketId: 100000 + count,
  });
  res.status(200).json({
    data: ticket,
    status: "success",
    message: "successfully created ticket",
  });
});

exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await DeliveryPartnerTicket.find({
    deliveryPartner: req.deliveryPartner._id,
  });
  res.status(200).json({
    data: ticket,
    status: "success",
    message: "successfully ",
  });
});
