const express = require("express");
const router = express.Router();
const { protect } = require("../../../controllers/admin/adminAuthController");
const cuisineController = require("../../../controllers/cuisine/cuisineController");

router
  .route("/cuisine")
  .post(protect, cuisineController.createCuisine)
  .get(protect, cuisineController.allCuisine);

router
  .route("/cuisine/:cuisineId")

  .patch(protect, cuisineController.updateCuisineVisible);

module.exports = router;
