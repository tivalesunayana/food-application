const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/asm/asmAuthController");
const asmOwnerController = require("../../controllers/asm/asmOwnerController");

router
  .route("/owner")
  .post(protect, asmOwnerController.createOwner)
  .get(protect, asmOwnerController.getOwner)
  .patch(protect, asmOwnerController.checkEmail);
module.exports = router;
