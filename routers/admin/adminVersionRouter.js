const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminVersionController = require("../../controllers/admin/adminVersionController");

router
  .route("/version")
  .get(protect, adminVersionController.getVersions)
  .post(protect, adminVersionController.editVersions);
module.exports = router;
