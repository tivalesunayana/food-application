const express = require("express");
const router = express.Router();
const ownerReportController = require("../../controllers/owner/ownerReportController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/report/today")
  .get(protect, ownerReportController.reportDataToday);
router.route("/report/week").get(protect, ownerReportController.reportDataWeek);
router
  .route("/report/month")
  .get(protect, ownerReportController.reportDataMonth);

module.exports = router;
