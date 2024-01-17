const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const {
  createAsm,
  getASM,
  getLiveLocationOfASM,
} = require("../../controllers/admin/adminASMController");

router.route("/asm").post(protect, createAsm).get(protect, getASM);
router.route("/asm/location").get(protect, getLiveLocationOfASM);
module.exports = router;
