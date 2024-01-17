const express = require("express");
const router = express.Router();
const adminActiveCustomerController = require("../../controllers/admin/adminActiveCustomerController");
const { protect } = require("../../controllers/admin/adminAuthController");

router
  .route("/activeCustomer")
  .get(protect, adminActiveCustomerController.activeCustomer);

module.exports = router;
