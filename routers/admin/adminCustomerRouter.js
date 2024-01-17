const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminCustomerController = require("../../controllers/admin/adminCustomerController");

router.route("/customer").get(protect, adminCustomerController.getCustomer);
module.exports = router;
