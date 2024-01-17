const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const adminDeliveryController = require("../../controllers/admin/adminDeliveryController");
const { imageUpload } = require("../../config/s3config");

router
  .route("/delivery")
  .get(protect, adminDeliveryController.getDeliveryPartner);
router
  .route("/deliveryPartner")
  .get(protect, adminDeliveryController.getDeliveryPartnerByCity);
router
  .route("/deliveryUnverified")
  .get(protect, adminDeliveryController.getDeliveryPartnerUnverified);
router
  .route("/getCashLog/:deliveryPartnerId")
  .get(protect, adminDeliveryController.getCashLog);
router
  .route("/getCashLogRemaining/:deliveryPartnerId")
  .get(protect, adminDeliveryController.getCashLogRemaining);

router
  .route("/delivery/unverified")
  .get(protect, adminDeliveryController.getDeliveryPartnerPending)
  .post(protect, adminDeliveryController.approveDeliveryPartner);

router
  .route("/delivery/block")
  .post(protect, adminDeliveryController.suspendDeliveryPartner);

router
  .route("/delivery/referAndEarn")
  .get(protect, adminDeliveryController.getReferAndEarnAmount)
  .post(protect, adminDeliveryController.updateReferAndEarnAmount);

router
  .route("/delivery/location")
  .get(protect, adminDeliveryController.getLiveLocationOfDeliveryPartner);

router.route("/delivery/log").post(adminDeliveryController.getLogTiming);

router
  .route("/delivery/log/single")
  .post(protect, adminDeliveryController.getSingleLogTiming);

router
  .route("/delivery/partner/search")
  .get(adminDeliveryController.searchDeliveryPartner);

router
  .route("/delivery/cash")
  .get(protect, adminDeliveryController.deliveryPartnerCashData)
  .post(protect, adminDeliveryController.deliveryPartnerAmountSubmit);

//sunayana
router
  .route("/delivery/earning")
  .get(protect, adminDeliveryController.deliveryEarning);
//sunayana

router
  .route("/delivery/live")
  .get(protect, adminDeliveryController.getLiveDeliveryPartner);

router
  .route("/upload/deliveryBoySelfie")
  .get(
    protect,
    imageUpload.single("image"),
    adminDeliveryController.getTodayDeliveryselfie
  );

router.route("/earning").get(protect, adminDeliveryController.deliveryEarning);

module.exports = router;
