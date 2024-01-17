const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const deliveryPartnerVehicleSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, enum: ["Bike", "Cycle", "Scooty"] },
    deliveryPartner: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    vehicleName: { type: String },
    vehicleAge: { type: Number },
    vehicleNumber: { type: String },
    drivingLicenseFront: { type: String },
    drivingLicenseBack: { type: String },
    vehicleInsurance: { type: String },
    psu: { type: String },
    rc: { type: String },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartnerVehicle = mongoose.model(
  "DeliveryPartnerVehicle",
  deliveryPartnerVehicleSchema
);

module.exports = DeliveryPartnerVehicle;
