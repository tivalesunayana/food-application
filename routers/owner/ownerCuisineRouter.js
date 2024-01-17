const express = require("express");
const router = express.Router();
const cuisineController = require("../../controllers/cuisine/cuisineController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router.route("/cuisine").get(protect, cuisineController.cuisine);

module.exports = router;
