const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const {
  createOwner,
  getOwner,
  searchOwnerPartner,
  getSingleOwner,
  deleteOwner,
  editOwner,
} = require("../../controllers/admin/adminOwnerController");

router
  .route("/owner")
  .post(protect, createOwner)
  .patch(protect, editOwner)
  .get(protect, getOwner)
  .delete(protect, deleteOwner);
router.route("/owner/single").get(protect, getSingleOwner);
router.route("/owner/search").get(protect, searchOwnerPartner);

module.exports = router;
