const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminDashboardController = require("../../controllers/admin/adminDashboardController");

router.route("/dashboard").get(adminDashboardController.getDashBoard);
module.exports = router;
