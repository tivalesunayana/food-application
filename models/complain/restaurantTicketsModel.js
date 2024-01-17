const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantTicketsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },

    solution: {
      type: String,
    },
    rating: { type: Number },
    ticketId: {
      type: Number,
    },
    satisfaction: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const RestaurantTickets = mongoose.model(
  "RestaurantTickets",
  restaurantTicketsSchema
);

module.exports = RestaurantTickets;
