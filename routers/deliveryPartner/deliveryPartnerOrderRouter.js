const express = require("express");
const router = express.Router();
const deliveryPartnerOrder = require("../../controllers/deliveryPartner/deliveryPartnerOrder");
const {
  protect,
} = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");

router.route("/order/current").post(protect, deliveryPartnerOrder.currentOrder);

router
  .route("/order/delivered")
  .post(protect, deliveryPartnerOrder.deliveredDeliveryUpdate);
router
  .route("/order/pickedUp")
  .post(
    protect,
    imageUpload.single("image"),
    deliveryPartnerOrder.pickedUpDeliveryUpdate
  );
router
  .route("/order/reachedCustomer")
  .post(protect, deliveryPartnerOrder.reachedCustomerDeliveryUpdate);
router
  .route("/order/call/customer")
  .get(protect, deliveryPartnerOrder.callCustomer);
router
  .route("/order/call/restaurant")
  .get(protect, deliveryPartnerOrder.callRestaurant);
router
  .route("/order/reachedRestaurant")
  .post(protect, deliveryPartnerOrder.reachedRestaurantDeliveryUpdate);

router
  .route("/order/request")
  .post(protect, deliveryPartnerOrder.locationAndWaitingOrder);

router.route("/order/accept").post(protect, deliveryPartnerOrder.acceptOrder);

// router
//   .route("/getCashLog/:deliveryPartnerId")
//   .get(protect, deliveryPartnerOrder.getCashLog);
// router
//   .route("/getCashLogRemaining/:deliveryPartnerId")
//   .get(protect, deliveryPartnerOrder.getCashLogRemaining);

module.exports = router;
