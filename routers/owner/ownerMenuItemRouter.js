const express = require("express");
const router = express.Router();
const ownerMenuItemController = require("../../controllers/owner/ownerMenuItemController");
const { protect } = require("../../controllers/owner/ownerAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/menuItem")
  .get(protect, ownerMenuItemController.getRestaurantItems);
// .post(protect, ownerMenuItemController.createMenuItem)
// .patch(
//   protect,
//   imageUpload.single("image"),
//   ownerMenuItemController.uploadImageMenuItem
// )
// .put(protect, ownerMenuItemController.getSingleMenuItem);

// router
//   .route("/menuItem/edit")
// .post(protect, ownerMenuItemController.editMenuItem);

// router
//   .route("/menuItem/time")
//   .post(protect, ownerMenuItemController.setTimeForMenuItem);
router
  .route("/menuItem/available")
  .post(protect, ownerMenuItemController.updateAvailableOfMenuItem);

router.route("/menuItem/adons").get(protect, ownerMenuItemController.getAddon);
// router
//   .route("/option")
//   .get(protect, ownerMenuItemController.getOption)
//   .post(protect, ownerMenuItemController.createOption)
//   .patch(protect, ownerMenuItemController.addItemOption);

// router
//   .route("/sub-category")
//   .get(protect, ownerMenuItemController.getSubCategory)
//   .post(protect, ownerMenuItemController.createSubCategory);

// router
//   .route("/sub-category/edit")
//   .post(protect, ownerMenuItemController.editSubCategory);

// router
//   .route("/menu-category")
//   .get(protect, ownerMenuItemController.getMenuCategory)
//   .post(protect, ownerMenuItemController.createMenuCategory);

// router
//   .route("/menu-category/edit")
//   .post(protect, ownerMenuItemController.editMenuCategory);

// router
//   .route("/customization")
//   .get(protect, ownerMenuItemController.getCustomization)
//   .post(protect, ownerMenuItemController.createCustomization)
//   .patch(protect, ownerMenuItemController.addItemCustomization);

router.route("/addon").get(protect, ownerMenuItemController.getAddOn);
// .post(protect, ownerMenuItemController.createAddOn)
// .patch(protect, ownerMenuItemController.addItemAddOn);

// router.route("/addon/edit").post(protect, ownerMenuItemController.editAddOn);
// router
//   .route("/addon/item/edit")
//   .post(protect, ownerMenuItemController.editAddOnItem);

module.exports = router;
