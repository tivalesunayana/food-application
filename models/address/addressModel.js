const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const addressSchema = new mongoose.Schema(
  {
    addressType: {
      type: String,
      enum: ["Work", "Home", "Hotel", "Other"],
      required: [true, "please enter your type!"],
    },
    completeAddress: {
      type: String,
      required: [true, "please enter your address!"],
    },
    city: {
      type: String,
      required: [true, "please enter your city!"],
    },
    state: {
      type: String,
      required: [true, "please enter your state!"],
    },
    landmark: {
      type: String,
      default: null,
    },
    defaultAddress: { type: Boolean, default: true },
    pinCode: {
      type: Number,
      required: [true, "please enter your pin Code!"],
    },
    deleted: {
      type: Boolean,
      default: false,
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
        required: [true, "please enter your coordinates!"],
      },
    },
  },
  {
    timestamps: true,
  }
);
addressSchema.index({ location: "2dsphere" });
const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
