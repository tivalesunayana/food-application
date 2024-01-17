const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/adminAuthController");

router
  .route("/")
  .get(adminAuthController.protect, adminAuthController.dashboard)
  .post(adminAuthController.adminLogin);
//   .patch(adminAuthController.changePassword);

router
  .route("/forget/password")
  .post(adminAuthController.forgetPassword)
  .patch(adminAuthController.changePasswordOTP);

router
  .route("/profile/update")
  .post(adminAuthController.protect, adminAuthController.adminProfileUpdate);

router.route("/create/admin").post(
  // adminAuthController.protect,
  adminAuthController.adminSignup
);

router
  .route("/get/admin")
  .get(adminAuthController.protect, adminAuthController.getAllAdmins);

router
  .route("/delete/admin/:id")
  .delete(adminAuthController.protect, adminAuthController.deleteAdminUser);
router
  .route("/profile/update/password")
  .post(adminAuthController.protect, adminAuthController.profilePasswordUpdate);

router.route("/logout").get(adminAuthController.logOut);

module.exports = router;
