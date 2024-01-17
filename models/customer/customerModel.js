const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    meta: { type: JSON },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail],
    },
    dob: {
      type: Date,
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

    phone: {
      type: String,
      required: [true, "please tell us your phone no!"],
      unique: true,
    },

    addresses: [{ type: Schema.ObjectId, ref: "Address" }],

    notificationToken: {
      type: String,
      required: [true, "please tell us your notifications token!"],
    },

    currentLocation: {
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
  },
  {
    timestamps: true,
  }
);
customerSchema.index({ currentLocation: "2dsphere" });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
