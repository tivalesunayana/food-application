const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const orderSchema = new mongoose.Schema(
  {
    customer: { type: Schema.ObjectId, ref: "Customer" },
    orderId: { type: Number },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    coupon: { type: Schema.ObjectId, ref: "Coupon" },
    payment: { type: Schema.ObjectId, ref: "Payment" },
    orderItems: [{ type: Schema.ObjectId, ref: "OrderItem" }],
    pickUpImage: { type: String },
    petPoojaOrderId: { type: String },
    otp: { type: Number },
    rejectionReject: { type: String },
    deliveryPartner: {
      type: Schema.ObjectId,
      ref: "DeliveryPartner",
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    customerAddress: { type: Schema.ObjectId, ref: "Address" },
    orderReview: { type: Schema.ObjectId, ref: "OrderReview" },
    restaurantAddress: { type: Schema.ObjectId, ref: "Address" },
    customerRestaurantReview: {
      type: Schema.ObjectId,
      ref: "RestaurantReview",
    },
    deliveryPartnerReviewByCustomer: {
      type: Schema.ObjectId,
      ref: "DeliveryPartnerReviewCustomer",
    },
    customerReviewByDeliveryPartner: {
      type: Schema.ObjectId,
      ref: "CustomerDeliveryPartnerReview",
    },
    restaurantReviewByDeliveryPartner: {
      type: Schema.ObjectId,
      ref: "RestaurantReviewDeliveryPartner",
    },
    deliveryPartnerReviewByRestaurant: {
      type: Schema.ObjectId,
      ref: "DeliveryPartnerReviewRestaurant",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Reject",
        "Ready",
        "Picked-up",
        "Cancelled",
        "Delivered",
      ],
      default: "Pending",
    },
    deliveryStatus: {
      type: String,
      enum: [
        "Searching",
        "Accepted",
        "Reject",
        "ReachedRestaurant",
        "ReachedCustomer",
        "Picked-up",
        "Delivered",
      ],
      default: "Searching",
    },
    paymentMode: { type: String, enum: ["kotak", "COD"] },
    acceptedAt: { type: Date },
    rejectAt: { type: Date },
    cancelledAt: { type: Date },
    preparingAt: { type: Date },
    reachedRestaurantAt: { type: Date },
    reachedCustomerAt: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    readyAt: { type: Date },
    paymentStatus: {
      type: String,
      enum: [
        "Failed",
        "Pending",
        "Paid",
        "COD",
        "Refunded-In-Progress",
        "Refunded",
      ],
      default: "Pending",
    },
    grandTotalPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalTaxes: {
      type: Number,
      default: 0,
    },
    grandTotalTaxes: {
      type: Number,
      default: 0,
    },
    deliveryTip: { type: Number, default: 0 },

    packagingCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    petPoojaData: {
      type: String,
    },
    duration: {
      type: Number,
    },
    distance: {
      type: Number,
    },
    preparationTime: {
      type: Number,
    },
    manualOrderAssign: {
      type: Boolean,
      default: false,
    },
    deliveryBoyShare: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
