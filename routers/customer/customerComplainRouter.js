const express = require("express");
const router = express.Router();
const customerOrderController = require("../../controllers/customer/customerOrderController");
const {
  protect,
} = require("../../controllers/customer/customerAuthController");
const { imageUpload } = require("../../config/s3config");
router
  .route("/complain")

  .get(protect, customerOrderController.getMyComplain)
  .post(
    protect,
    imageUpload.single("image"),
    customerOrderController.createOrderComplain
  );
module.exports = router;
