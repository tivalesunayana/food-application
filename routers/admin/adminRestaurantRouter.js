const express = require("express");
const router = express.Router();
const adminRestaurantController = require("../../controllers/admin/adminRestaurantController");
const { protect } = require("../../controllers/admin/adminAuthController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/restaurants/unapproved")
  .get(protect, adminRestaurantController.getRestaurantUnapproved)
  .put(protect, adminRestaurantController.searchUnapprovedRestaurant)
  .post(protect, adminRestaurantController.approveRestaurant);

router
  .route("/menuItems/unapproved")
  .get(protect, adminRestaurantController.getUnVariatedMenuItem)
  .post(protect, adminRestaurantController.approveRestaurant);

router
  .route("/restaurants")
  .get(protect, adminRestaurantController.getRestaurantApproved)
  .put(protect, adminRestaurantController.searchApprovedRestaurant);

router
  .route("/restaurants/pet_pooja")
  .get(protect, adminRestaurantController.getPetPoojaRestaurants)
  .put(protect, adminRestaurantController.searchApprovedRestaurant);
router
  .route("/restaurants/getOrdersByTime")
  .get(protect, adminRestaurantController.getRestaurantOrdersByTimePeriod);
router
  .route("/restaurants/getOrdersByDate")
  .get(protect, adminRestaurantController.getRestaurantOrdersByDateRange);
router
  .route("/restaurants/pet_pooja/unapproved")
  .get(protect, adminRestaurantController.unapprovedPetPetPoojaRestaurants)
  .put(protect, adminRestaurantController.searchUnapprovedPetPetPoojaRestaurant)
  .post(protect, adminRestaurantController.approveRestaurantPetPooja);

// router
//   .route("/restaurant/time")
//   .post(protect, adminRestaurantController.restaurantTiming);
//code
//get filter unapproved restaurant
router
  .route("/restaurants/unapprovedfilter")
  .get(protect, adminRestaurantController.getThaneRestaurantUnapproved);
//get bhiwandi unaaproved restaurant

//get filter restaurant approved
router
  .route("/restaurants/approvedfilter")
  .get(protect, adminRestaurantController.getRestaurantApprovedFilter);

router
  .route("/reportCalculation")
  .get(protect, adminRestaurantController.reportCalculation);

//code

router
  .route("/restaurants/online")
  .get(protect, adminRestaurantController.getOnlineRestaurant);

router.route("/menuItems").get(protect, adminRestaurantController.getMenuItem);

router
  .route("/restaurants/document")
  .post(protect, adminRestaurantController.approveRestaurantDocument);

router
  .route("/restaurants/bank")
  .get(protect, adminRestaurantController.approveRestaurantBank);

router
  .route("/restaurants/menuItem")
  .get(protect, adminRestaurantController.getUnapprovedMenuItem)
  .post(protect, adminRestaurantController.approveRestaurantMenuItem);

router
  .route("/restaurants/search")
  .get(protect, adminRestaurantController.searchRestaurant);
  router
  .route("/restaurants/bhiwandi/search")
  .get(protect, adminRestaurantController.searchBRestaurant);

  router
  .route("/restaurants/bhiwandi/search")
  .put(protect, adminRestaurantController.searchBhiwandiRestaurant);

router
  .route("/restaurant/edit")
  .post(protect, adminRestaurantController.editRestaurant);

router
  .route("/restaurant/edit/location")
  .post(protect, adminRestaurantController.editRestaurantLocation);

router
  .route("/restaurants/appVisible")
  .post(protect, adminRestaurantController.appVisibleRestaurantBank);

router
  .route("/restaurant/menuItem/csv")
  .post(protect, adminRestaurantController.createMenuItemWithCSV);

router
  .route("/restaurant/report")
  .post(adminRestaurantController.getRestaurantReport);
router
  .route("/restaurant/reports")
  .get(adminRestaurantController.getRestaurantReports);
// onboarding

router
  .route("/restaurant/create")
  .post(protect, adminRestaurantController.createRestaurant)
  .patch(
    protect,
    imageUpload.single("image"),
    adminRestaurantController.uploadRestaurantLogo
  );

router
  .route("/restaurant/fssai")
  .post(
    protect,
    imageUpload.single("file"),
    adminRestaurantController.createAndUploadFssai
  );
router
  .route("/restaurant/pan")
  .post(
    protect,
    imageUpload.single("file"),
    adminRestaurantController.createAndUploadPan
  );

router
  .route("/restaurant/aadhar")
  .post(
    protect,
    imageUpload.single("file"),
    adminRestaurantController.createAndUploadAadhar
  );

router
  .route("/restaurant/gst")
  .post(
    protect,
    imageUpload.single("file"),
    adminRestaurantController.createAndUploadGst
  );

router
  .route("/restaurant")
  .get(protect, adminRestaurantController.getRestaurant);

//jan10

router
  .route("/restaurant/item")
  .get(protect, adminRestaurantController.getRestaurantItem);



router
  .route("/restaurant/bank")
  .post(protect, adminRestaurantController.addBankDetail);

router
  .route("/restaurant/contact")
  .post(protect, adminRestaurantController.updateContactDetails);

router
  .route("/restaurant/time")
  .post(protect, adminRestaurantController.updateTime);

router
  .route("/restaurant/tax")
  .get(protect, adminRestaurantController.getTaxes)
  .post(protect, adminRestaurantController.createTax);

router
  .route("/restaurant/attribute")
  .get(protect, adminRestaurantController.getAttributes)
  .post(protect, adminRestaurantController.createAttribute)
  .patch(protect, adminRestaurantController.editAttribute);

router
  .route("/restaurant/menu/item/file")
  .post(
    protect,
    imageUpload.single("document"),
    adminRestaurantController.uploadMenuItemsFile
  );

router
  .route("/restaurant/delete")
  .delete(protect, adminRestaurantController.deleteRestaurant);

router
  .route("/restaurants/itemVisible")
  .post(protect, adminRestaurantController.visibleItem);
// router.route("/restaurant/fix").get(adminRestaurantController.fix);

router
.route("/restaurants/getRestaurant")
.get(protect,adminRestaurantController.getBhiwandiRestaurant)

router
.route("/restaurants/price/:itemId")
.patch(protect,adminRestaurantController.getBhiwandiRestaurantItemPrice)
router
.route("/restaurants/item/:resId")
.get(protect,adminRestaurantController.getRestaurantItemPrice)

module.exports = router;
