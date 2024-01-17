const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const restaurnNotificationSchema = new Schema({
    title: { type: String },
    description: { type: String },
    show: { type: Boolean, default: true },

    image: { type: String },
}, {
    timestamps: true,
});

const RestaurantNotification = mongoose.model("RestaurantNotification", restaurnNotificationSchema);


module.exports=RestaurantNotification