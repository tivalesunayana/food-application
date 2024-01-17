const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order/orderModel");
const mongoose = require("mongoose");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
exports.deliveryPartnerLiveLocation = catchAsync(async (req, res, next) => {
  try {
    const partnerId = req.params.partnerId;

    const locationData = await DeliveryPartnerCurrentLocation.findOne({
      deliveryPartner: partnerId,
    });
    console.log(`locationData :${locationData}`);
    if (!locationData) {
      return res
        .status(404)
        .json({ error: "Delivery partner location not found" });
    }

    const location = {};

    if (locationData.location) {
      location.type = locationData.location.type;

      location.coordinates = locationData.location.coordinates;
    } else {
      location.type = "Unknown";
      location.coordinates = [0, 0]; // default coordinates
    }

    if (locationData.locationUpdatedAt) {
      location.locationUpdatedAt = locationData.locationUpdatedAt;
    } else {
      location.locationUpdatedAt = new Date(); // Or any default value
    }

    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
