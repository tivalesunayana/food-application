const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerTicketSchema = new mongoose.Schema(
  {
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    topic: { type: String },
    description: { type: String },
    solved: { type: Boolean, default: false },
    ticketId: { type: Number },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerTicket = mongoose.model(
  "DeliveryPartnerTicket",
  deliveryPartnerTicketSchema
);

module.exports = DeliveryPartnerTicket;
