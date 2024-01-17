const express = require("express");
const router = express.Router();
const petPoojaController = require("../../controllers/petPooja/petPoojaController");

router.route("/menu/sharing").post(petPoojaController.getMenuSharing);
router.route("/menu/on").post(petPoojaController.menuItemOn);
router.route("/menu/off").post(petPoojaController.menuItemOff);
router.route("/order/update").post(petPoojaController.getCallBackUpdateOrder);
router.route("/store/get/update").post(petPoojaController.getStoreUpdate);
router.route("/store/update").post(petPoojaController.storeUpdate);
router
  .route("/restaurant/onboarding")
  .post(petPoojaController.restaurantOnboarding);
module.exports = router;
