const RestaurantReservation = require("../../models/reservation/reservationRestaurantModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");

exports.getAllReservation = catchAsync(async (req, res, next) => {
  const { restaurantId, page, limit } = req.query;
  const skip = page * limit - limit;
  const reservation = await RestaurantReservation.find({
    restaurant: restaurantId,
    status: "Pending",
  })
    .populate({ path: "customer", select: "name " })
    .skip(skip)
    // .limit(limit)
    .limit(limit || 10)

    .sort({ _id: -1 });
  res.status(200).json({
    data: reservation,
    status: "success",
    message: "successFully",
  });
});
exports.reservationSwitch = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { dining } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.dining = dining;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "successFully",
  });
});

exports.getByDateReservation = catchAsync(async (req, res, next) => {
  const { restaurantId, page, limit } = req.query;
  const { date } = req.body;
  console.log(date);
  const skip = page * limit - limit;
  const queryDate = new Date(date);
  const queryDateEnd = new Date(queryDate.getTime() + 86400000);

  const reservation = await RestaurantReservation.find({
    restaurant: restaurantId,
    time: { $gte: queryDate, $lte: queryDateEnd },
  })
    .populate({ path: "customer", select: "name " })
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 });
  res.status(200).json({
    data: reservation,
    status: "success",
    message: "successFully",
  });
});

exports.rejectReservation = catchAsync(async (req, res, next) => {
  const { reservationId } = req.query;
  const { rejectionReject } = req.body;

  const reservation = await RestaurantReservation.findById(
    reservationId
  ).populate({ path: "customer", select: "name " });
  reservation.rejectionReject = rejectionReject;
  reservation.status = "Reject";
  await reservation.save();
  res.status(200).json({
    data: reservation,
    status: "success",
    message: "successFully",
  });
});

exports.confirmedReservation = catchAsync(async (req, res, next) => {
  const { reservationId } = req.query;
  console.log(reservationId);
  const reservation = await RestaurantReservation.findById(
    reservationId
  ).populate({ path: "customer", select: "name " });

  reservation.status = "Confirmed";
  await reservation.save();
  res.status(200).json({
    data: reservation,
    status: "success",
    message: "successFully",
  });
});
