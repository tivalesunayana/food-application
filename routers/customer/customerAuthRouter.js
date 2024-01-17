const express = require("express");
const { imageUpload } = require("../../config/s3config");
const router = express.Router();
const customerAuthController = require("./../../controllers/customer/customerAuthController");
router.route("/login").post(customerAuthController.signupWithGoogle);
router
  .route("/")
  .post(customerAuthController.protect, customerAuthController.dashboard)
  .delete(
    customerAuthController.protect,
    customerAuthController.deletedAccount
  );

router
  .route("/account/delete")

  .get(customerAuthController.protect, customerAuthController.deletedAccount);

router
  .route("/address")
  .get(customerAuthController.protect, customerAuthController.getAllAddress)
  .post(customerAuthController.protect, customerAuthController.createAddress)
  .patch(customerAuthController.protect, customerAuthController.updateAddress)
  .put(customerAuthController.protect, customerAuthController.setDefaultAddress)
  .delete(customerAuthController.protect, customerAuthController.deleteAddress);

router
  .route("/profile")
  .post(customerAuthController.protect, customerAuthController.updateProfile)
  .patch(
    customerAuthController.protect,
    imageUpload.single("image"),
    customerAuthController.updateProfilePhoto
  );
router.route("/version").get(customerAuthController.getAppVersion);
router.route("/version/ios").get(customerAuthController.getIosVersion);

module.exports = router;
