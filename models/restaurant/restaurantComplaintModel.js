const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantComplaintSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    complaint: { type: String },
    visible: { type: Boolean, default: false },
    image: [{ type: String }],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "complete"],
    },
  },
  {
    timestamps: true,
  }
);

const restaurantComplaint = mongoose.model(
  "restaurantComplaint",
  restaurantComplaintSchema
);

module.exports = restaurantComplaint;
