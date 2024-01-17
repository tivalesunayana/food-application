const express = require("express");
const router = express.Router();
const ownerAddOnController = require("../../controllers/owner/ownerAddOnController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/addOns")
  .get(protect, ownerAddOnController.getAddOns)
  .post(protect, ownerAddOnController.updateAddOnItems);

module.exports = router;
