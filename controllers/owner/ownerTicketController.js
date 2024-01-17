const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const RestaurantTickets = require("../../models/complain/restaurantTicketsModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
exports.createTicket = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("restaurantId is wrong", 404));
  }
  const count = await RestaurantTickets.count();
  const ticket = await RestaurantTickets.create({
    title,
    description,
    ticketId: count + 100000,
    restaurant: restaurantId,
  });
  res.status(200).json({
    status: "success",
    message: "Ticket created successfully",
    data: ticket,
  });
});

exports.getAllTicket = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const ticket = await RestaurantTickets.find({
    restaurant: restaurantId,
  });
  res.status(200).json({
    status: "success",
    message: "Ticket created successfully",
    data: ticket,
  });
});
exports.satisfactionTicket = catchAsync(async (req, res, next) => {
  const { satisfaction, rating } = req.body;
  const { ticketId } = req.query;
  const ticket = await RestaurantTickets.findById(ticketId);
  ticket.satisfaction = satisfaction;
  ticket.rating = rating;
  await ticket.save();
  res.status(200).json({
    status: "success",
    message: "Ticket satisfaction submitted successfully",
    data: ticket,
  });
});
