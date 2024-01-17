const express = require("express");
const router = express.Router();
const asmAuthController = require("../../controllers/asm/asmAuthController");
const { imageUpload } = require("../../config/s3config");
router.route("/login").post(asmAuthController.loginWithGoogle);
router.route("/").get(asmAuthController.protect, asmAuthController.dashboard);
router
  .route("/photo")
  .post(
    asmAuthController.protect,
    imageUpload.single("image"),
    asmAuthController.uploadPhoto
  );
router
  .route("/")
  .put(asmAuthController.protect, asmAuthController.updateLocation);

router.route("/version").get(asmAuthController.getAppVersion);

module.exports = router;
