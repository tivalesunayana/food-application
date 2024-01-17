const mongoose = require("mongoose");

const bhiwandiOrderReportSchema = new mongoose.Schema(
  {
    deliveredOrderId: { type: Schema.ObjectId, ref: "Order" },
    restaurantId: { type: Schema.ObjectId, ref: "Restaurant" },
    customerId: { type: Schema.ObjectId, ref: "Customer" },
    deliveryPartnerId: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    bankDetails: { type: Schema.ObjectId, ref: "BankDetail" },
    couponType: { type: Schema.ObjectId, ref: "Coupon" },
    menuPrice:  { type: Number, default: 0 },
    totalAmountAsperFetch: { type: Number, default: 0 },
    totalAmountPayable: { type: Number, default: 0 },
    totalAmountPerOrder: { type: Number, default: 0 },
    amountAddedPerOrder: { type: Number, default: 0 },
    gSTOnMenuCart: { type: Number, default: 0 },
    ybitesCommision: { type: Number, default: 0 },
totalGst: { type: Number, default: 0 },
ybitesCollection: { type: Number, default: 0 },
totalCommission: { type: Number, default: 0 },
restaurantAfterDiscountPrice: { type: Number, default: 0 },
    deduction: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    petPooja: {
      type: Boolean,
      default: false,
    },


  },
  {
    timestamps: true,
  }
);

const BhiwandiOrderReport = mongoose.model(
  "BhiwandiOrderReport",
  bhiwandiOrderReportSchema
);

module.exports = BhiwandiOrderReport;
