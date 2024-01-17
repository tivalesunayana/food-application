const mongoose = require("mongoose");
Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const ownerReportSchema = new mongoose.Schema({
  restaurant: [{ type: Schema.ObjectId, ref: "Restaurant" }],
  order: [{ type: Schema.ObjectId, ref: "Order" }],
  coupon: [{ type: Schema.ObjectId, ref: "Coupon" }],
});

const OwnerReport = mongoose.model("OwnerReport", ownerReportSchema);

module.exports = OwnerReport;
