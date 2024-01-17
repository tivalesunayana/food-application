const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// const validator = require("validator");
const restaurantSchema = new mongoose.Schema(
  {
    outlet_id: { type: String },
    brand_display_name: { type: String },
    owner_name: { type: String },
    outlet_name: { type: String },
    address: { type: String },
    landmark: { type: String },
    area: { type: String },
    state: { type: String },
    pincode: { type: String },
    city: { type: String },
    business_contact: { type: String },
    merchant_number: { type: String },
    email: { type: String },
    is_support_self_delivery: { type: String },
    serving_radius: { type: String },
    fssai_no: { type: String },
    fssai_image: { type: String },
    pan_no: { type: String, default: "" },
    pan_image: { type: String },
    aadhar_no: { type: String },
    aadhar_image: { type: String },
    gst_no: { type: String },
    gst_image: { type: String },
    restaurant_logo: { type: String },
    cuisines: { type: String },
    menuItemsFile: { type: String },
    rating: { type: Number },
    ratingCount: { type: Number, default: 0 },
    res_timings: [
      {
        day: { type: Number },
        slots: [
          {
            to: { type: String },
            from: { type: String },
          },
          {
            to: { type: String },
            from: { type: String },
          },
        ],
        active: { type: String },
      },
    ],
    petPooja: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    appVisible: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
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

    ordertypes: [
      {
        type: Schema.ObjectId,
        ref: "Ordertypes",
      },
    ],
    bankDetail: {
      type: Schema.ObjectId,
      ref: "BankDetail",
    },

    categories: [
      {
        type: Schema.ObjectId,
        ref: "Categories",
      },
    ],
    parentcategories: [
      {
        type: Schema.ObjectId,
        ref: "ParentCategories",
      },
    ],
    taxes: [
      {
        type: Schema.ObjectId,
        ref: "Taxes",
      },
    ],
    attributes: [
      {
        type: Schema.ObjectId,
        ref: "Attributes",
      },
    ],
    variations: [
      {
        type: Schema.ObjectId,
        ref: "Variations",
      },
    ],
    addongroups: [
      {
        type: Schema.ObjectId,
        ref: "Addongroups",
      },
    ],
    items: [
      {
        type: Schema.ObjectId,
        ref: "Items",
      },
    ],
    asm: {
      type: Schema.ObjectId,
      ref: "ASM",
    },
    admin: {
      type: Schema.ObjectId,
      ref: "Admin",
    },
    owner: {
      type: Schema.ObjectId,
      ref: "Owner",
    },
    status: {
      type: Schema.ObjectId,
      ref: "RestaurantStatusModel",
    },
  },
  {
    timestamps: true,
  }
);
restaurantSchema.pre(/^find/, function (next) {
  this.find({ deleted: { $ne: true } });

  next();
});
restaurantSchema.pre(/^count/, function (next) {
  this.find({ deleted: { $ne: true } });

  next();
});
restaurantSchema.index({ location: "2dsphere" });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
