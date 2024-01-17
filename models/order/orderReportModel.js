const mongoose = require("mongoose");
Schema = mongoose.Schema;

const orderReportSchema = new mongoose.Schema(
  {
    deliveredOrderId: { type: Schema.ObjectId, ref: "Order" },
    restaurantId: { type: Schema.ObjectId, ref: "Restaurant" },
    customerId: { type: Schema.ObjectId, ref: "Customer" },
    deliveryPartnerId: { type: Schema.ObjectId, ref: "DeliveryPartner" },
    bankDetails: { type: Schema.ObjectId, ref: "BankDetail" },
    couponType: { type: Schema.ObjectId, ref: "Coupon" },
    YbitesCommission: {
      type: Number,
      default: 0,
    },
    ybitesAfterDiscountPrice: { type: Number, default: 0 },
    restaurantAfterDiscountPrice: { type: Number, default: 0 },
    actualAmountCollectedOnMenu: { type: Number, default: 0 },
    gstOnCommissionRestaurant: {
      type: Number,
      default: 0,
    },
    totalAmountPayable: {
      type: Number,
      default: 0,
    },
    tdsOnAmountPayable: {
      typeof: Number,
      default: 0,
    },
    netPayableAmount: {
      type: Number,
      default: 0,
    },
    gstOnDelivery: {
      type: Number,
      default: 0,
    },
    gstOnPackingCharge: {
      type: Number,
      default: 0,
    },
    gstOnMenuCustomer: { type: Number, default: 0 },
    totalGst: {
      type: Number,
      default: 0,
    },
    totalTds: {
      type: Number,
      default: 0,
    },
    ybitesCollection: {
      type: Number,
      default: 0,
    },
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

const OrderReports = mongoose.model("OrderReports", orderReportSchema);
module.exports = OrderReports;
