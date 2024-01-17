const express = require("express");
const router = express.Router();
const ownerManagerController = require("../../controllers/owner/ownerManagerController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router
  .route("/create/manager")
  .post(protect, ownerManagerController.createManager);

router.route("/manager").get(protect, ownerManagerController.getManager);

router
  .route("/remove/manager/:manager")
  .delete(protect, ownerManagerController.removeManager);

module.exports = router;
