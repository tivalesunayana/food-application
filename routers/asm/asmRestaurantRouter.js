const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/asm/asmAuthController");
const { imageUpload } = require("../../config/s3config");

const asmRestaurantController = require("../../controllers/asm/asmRestaurantController");

router
  .route("/restaurant/create")
  .post(protect, asmRestaurantController.createRestaurant)
  .patch(
    protect,
    imageUpload.single("image"),
    asmRestaurantController.uploadRestaurantLogo
  );

router
  .route("/restaurant/fssai")
  .post(
    protect,
    imageUpload.single("file"),
    asmRestaurantController.createAndUploadFssai
  );
router
  .route("/restaurant/pan")
  .post(
    protect,
    imageUpload.single("file"),
    asmRestaurantController.createAndUploadPan
  );

router
  .route("/restaurant/aadhar")
  .post(
    protect,
    imageUpload.single("file"),
    asmRestaurantController.createAndUploadAadhar
  );

router
  .route("/restaurant/gst")
  .post(
    protect,
    imageUpload.single("file"),
    asmRestaurantController.createAndUploadGst
  );

router
  .route("/restaurants")
  .get(protect, asmRestaurantController.getRestaurant);
router
  .route("/restaurant")
  .get(protect, asmRestaurantController.getSingleRestaurant);

router
  .route("/restaurant/bank")
  .post(protect, asmRestaurantController.addBankDetail);

router
  .route("/restaurant/contact")
  .post(protect, asmRestaurantController.updateContactDetails);

router
  .route("/restaurant/time")
  .post(protect, asmRestaurantController.updateTime);

router.route("/restaurant/tax").get(protect, asmRestaurantController.getTaxes);
// .post(protect, asmRestaurantController.createTax);
router
  .route("/restaurant/attribute")
  .get(protect, asmRestaurantController.getAttributes)
  .post(protect, asmRestaurantController.createAttribute);

router
  .route("/restaurant/menu/item/file")
  .post(
    protect,
    imageUpload.single("document"),
    asmRestaurantController.uploadMenuItemsFile
  );

module.exports = router;
