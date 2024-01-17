const express = require("express");
const router = express.Router();
const ownerRestaurantController = require("../../controllers/owner/ownerRestaurantController");
const { imageUpload } = require("../../config/s3config");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/restaurant/create")
  .post(protect, ownerRestaurantController.createRestaurant)
  .patch(
    protect,
    imageUpload.single("image"),
    ownerRestaurantController.uploadRestaurantLogo
  );

router
  .route("/restaurant/fssai")
  .post(
    protect,
    imageUpload.single("file"),
    ownerRestaurantController.createAndUploadFssai
  );
router
  .route("/restaurant/pan")
  .post(
    protect,
    imageUpload.single("file"),
    ownerRestaurantController.createAndUploadPan
  );

router
  .route("/restaurant/aadhar")
  .post(
    protect,
    imageUpload.single("file"),
    ownerRestaurantController.createAndUploadAadhar
  );

router
  .route("/restaurant/gst")
  .post(
    protect,
    imageUpload.single("file"),
    ownerRestaurantController.createAndUploadGst
  );

router
  .route("/restaurant")
  .get(protect, ownerRestaurantController.getRestaurant);

router
  .route("/restaurant/bank")
  .post(protect, ownerRestaurantController.addBankDetail);

router
  .route("/restaurant/contact")
  .post(protect, ownerRestaurantController.updateContactDetails);

router
  .route("/restaurant/time")
  .post(protect, ownerRestaurantController.updateTime);

module.exports = router;
