const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name!"],
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail],
    },
    image: {
      type: String,
    },
    notificationToken: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    status: {
      type: String,
      enum: ["active", "deleted", "suspended", "pending"],
      default: "pending",
    },

    vehicle: { type: Schema.ObjectId, ref: "DeliveryPartnerVehicle" },
    bankDetail: { type: Schema.ObjectId, ref: "BankDetail" },

    aadharCardFront: { type: String },
    aadharCardBack: { type: String },
    panCard: { type: String },

    address: { type: Schema.ObjectId, ref: "Address" },

    deliveryPartnerCurrentLocation: {
      type: Schema.ObjectId,
      ref: "DeliveryPartnerCurrentLocation",
    },
    // city: {
    //   type: String,
    //   required: [true, "Please provide the city"],
    // },
    phone: {
      type: String,
      required: [true, "please tell us your phone no!"],
      unique: true,
    },
    //sun
    dailyEarning: {
      type: Number,
      default: 0, // Default value if the field is not present
    },

    totalMonthlyEarnings: {
      type: Number,
      default: 0, // Default value if the field is not present
    },
    deductionAbsenty: {
      type: Number,
      default: 0, // Default value if the field is not present
    },
    amountPayToDeliveryBoy: {
      type: Number,
      default: 0,
    },
    paymentRelease: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);

module.exports = DeliveryPartner;
