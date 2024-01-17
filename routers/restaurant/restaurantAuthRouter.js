const express = require("express");
const router = express.Router();
const restaurantAuthController = require("../../controllers/restaurant/restaurantAuthController");
router.route("/login").post(restaurantAuthController.signWithGoogle);
router.route("/").get(restaurantAuthController.dashboard);
router.route("/logout").get(restaurantAuthController.logOut);
router.route("/version").get(restaurantAuthController.getAppVersion);
router
  .route("/restaurantOnline")
  .get(restaurantAuthController.restaurantOnline);

router
  .route("/restaurantOnlineVisible")
  .get(restaurantAuthController.restaurantOnlineappVisible);

router
  .route("/restaurantOffline")
  .get(restaurantAuthController.restaurantOffline);
module.exports = router;

router
  .route("/restaurantOflineVisible")
  .get(restaurantAuthController.restaurantOflineVisible);
