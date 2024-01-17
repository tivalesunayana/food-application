const express = require("express");
const router = express.Router();
const brandController = require("../../../controllers/brand/brandController");
const { protect } = require("../../../controllers/admin/adminAuthController");
const { imageUpload } = require("../../../config/s3config");
router
  .route("/brand")
  .post(protect, brandController.createBrand)
  .delete(protect, brandController.brandDelete)
  .get(protect, brandController.allBrand);

router
  .route("/brand/:brandId")
  .post(protect, imageUpload.single("image"), brandController.uploadBrandImage)
  .patch(protect, brandController.updateBrandVisible);

module.exports = router;
