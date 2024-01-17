const mongoose = require("mongoose");
Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  status: {
    type: String,
    enum: ["active", "deleted", "suspended"],
    default: "active",
  },
  restaurant: [{ type: Schema.ObjectId, ref: "Restaurant" }],
  phone: {
    type: String,
    required: [true, "please tell us your phone no!"],
    unique: true,
  },
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
