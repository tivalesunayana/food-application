const mongoose = require("mongoose");
const validator = require("validator");
const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    lowercase: true,
    validate: [validator.isEmail],
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  status: {
    type: String,
    enum: ["active", "deleted", "suspended"],
    default: "active",
  },
  restaurant: { type: Schema.ObjectId, ref: "Restaurant" },

  phone: {
    type: String,
    required: [true, "please tell us your phone no!"],
    unique: true,
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
