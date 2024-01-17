const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const RestaurantTickets = require("../../models/complain/restaurantTicketsModel");
const DeliveryPartnerTicket = require("../../models/deliveryPartner/deliveryPartnerTicketModel");
exports.getRestaurantTickets = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const restaurantTickets = await RestaurantTickets.find()
    .populate("restaurant")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await RestaurantTickets.count({ status: "active" });
  res.status(200).json({
    data: restaurantTickets,
    total,
    status: "success",
    message: "successfully",
  });
});

exports.updateRestaurantTickets = catchAsync(async (req, res, next) => {
  const { restaurantTicketId } = req.query;
  const { solution } = req.body;
  const restaurantTickets = await RestaurantTickets.findById(
    restaurantTicketId
  );
  restaurantTickets.solution = solution;
  await restaurantTickets.save();

  res.status(200).json({
    data: restaurantTickets,
    status: "success",
    message: "Successfully updated",
  });
});

exports.getDeliveryPartnerTickets = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const deliveryPartnerTickets = await DeliveryPartnerTicket.find()
    .populate("deliveryPartner")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await DeliveryPartnerTicket.count();
  res.status(200).json({
    data: deliveryPartnerTickets,
    total,
    status: "success",
    message: "successfully",
  });
});

exports.markedSolvedDeliveryPartnerTicket = catchAsync(
  async (req, res, next) => {
    const { ticketId } = req.query;

    const deliveryPartnerTicket = await DeliveryPartnerTicket.findById(
      ticketId
    );

    deliveryPartnerTicket.solved = true;
    await deliveryPartnerTicket.save();
    res.status(200).json({
      status: "success",
      message: "successfully marked as solved",
    });
  }
);
