const express = require("express");
const router = express.Router();
const ownerAuthController = require("../../controllers/owner/ownerAuthController");
router.route("/login").post(ownerAuthController.loginWithGoogle);
router.route("/signUp").post(ownerAuthController.signupWithGoogle);
router
  .route("/")
  .get(ownerAuthController.protect, ownerAuthController.dashboard);
router
  .route("/dashboard")
  .get(ownerAuthController.protect, ownerAuthController.dashboard);
// router.route("/signup").post(ownerAuthController.signupWithGoogle);
router.route("/check/email").post(ownerAuthController.checkEmail);
router.route("/version").get(ownerAuthController.getAppVersion);

module.exports = router;
