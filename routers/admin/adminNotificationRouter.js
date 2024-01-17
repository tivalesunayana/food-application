const express = require("express");
const { imageUpload } = require("../../config/s3config");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminNotificationController = require("../../controllers/admin/adminNotificationController");

router
  .route("/notification/customer")
  .get(protect, adminNotificationController.getNotificationForCustomer)

  .post(
    protect,
    imageUpload.single("image"),
    adminNotificationController.sendNotificationForCustomer
  )
  .patch(protect, adminNotificationController.updateNotificationForCustomer);

router
  .route("/notification/restaurant")
  .get(protect, adminNotificationController.getNotificationForRestauarnt)

  .post(
    protect,
    imageUpload.single("image"),
    adminNotificationController.sendNotificationForRestaurant
  )
  .patch(protect, adminNotificationController.updateNotificationForRestaurant);


router
  .route("/notification/delivery")
  .get(protect, adminNotificationController.getNotificationForDelivery)
  .post(
    protect,
    imageUpload.single("image"),
    adminNotificationController.sendNotificationForDelivery
  )
  .patch(protect, adminNotificationController.updateNotificationForDelivery);
module.exports = router;
