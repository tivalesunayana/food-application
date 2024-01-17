const express = require("express");
const router = express.Router();
const deliveryPartnerAuthController = require("../../controllers/deliveryPartner/deliveryPartnerAuthController");
const { imageUpload } = require("../../config/s3config");
const { protect } = require("../../controllers/admin/adminAuthController");

router.route("/login").post(deliveryPartnerAuthController.loginWithGoogle);
router.route("/check/network").get(deliveryPartnerAuthController.checkNetwork);
router
  .route("/")
  .get(
    deliveryPartnerAuthController.protect,
    deliveryPartnerAuthController.dashboard
  );
router.route("/signup").post(deliveryPartnerAuthController.signupWithGoogle);
router
  .route("/logout")
  .get(
    deliveryPartnerAuthController.protect,
    deliveryPartnerAuthController.logout
  );
router.route("/check/email").post(deliveryPartnerAuthController.checkEmail);
router
  .route("/check/Selfie")
  .get(
    deliveryPartnerAuthController.protect,
    deliveryPartnerAuthController.deliveryPartnerSelfieCheck
  );

router.route("/version").get(deliveryPartnerAuthController.getAppVersion);

router
  .route("/upload/Selfie")
  .post(
    deliveryPartnerAuthController.protect,
    imageUpload.single("image"),
    deliveryPartnerAuthController.uploadLoginSelfie
  );
router
  .route("/upload/deliveryBoySelfie")
  .post(
    deliveryPartnerAuthController.protect,
    imageUpload.single("image"),
    deliveryPartnerAuthController.uploadDeliveryselfie
  );

router
  .route("/upload/deliveryBoySelfie")
  .get(
    protect,
    imageUpload.single("image"),
    deliveryPartnerAuthController.getTodayDeliveryselfie
  );
router.route("/random/Selfie").post(
  // deliveryPartnerAuthController.protect,
  imageUpload.single("image"),
  deliveryPartnerAuthController.randomSelfie
);

module.exports = router;
