const mongoose = require("mongoose");
Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const asmSchema = new mongoose.Schema({
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
    default: "1.jpeg",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  designation: {
    type: String,
    enum: ["Area Sales Manager", "Sales Representative"],
  },
  notificationToken: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "deleted", "suspended"],
    default: "active",
  },
  restaurants: [{ type: Schema.ObjectId, ref: "Restaurant" }],
  phone: {
    type: String,
    required: [true, "please tell us your phone no!"],
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], //  [<longitude>, <latitude> ]
      required: [true, "please tell us your coordinates!"],
    },
  },
});
asmSchema.index({ location: "2dsphere" });

const ASM = mongoose.model("ASM", asmSchema);

module.exports = ASM;
