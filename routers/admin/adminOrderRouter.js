const express = require("express");
const router = express.Router();
const { protect } = require("../../controllers/admin/adminAuthController");
const {
  getOrders,
  searchOrderFilter,
  getPendingOrders,
  getNoDeliveryOrders,
  getNearByDeliveryForOrder,
  assignOrder,
  checkAssignStatus,
  rejectOrder,
  acceptOrder,
  readyOrder,
  getOrderReport,
  markedPaymentCompleted
} = require("../../controllers/admin/adminOrderController");
const {
  getRestaurantReport,
  getCalculatedRestaurantReport,
  // getPaymentCompletedModel,
  
} = require("../../controllers/admin/restaurantReports/restaurantReportController");
router.route("/orders").get(protect, getOrders);
router.route("/orders/pending").get(protect, getPendingOrders);
router.route("/orders/noDelivery").get(protect, getNoDeliveryOrders);
router.route("/order/filter").post(protect, searchOrderFilter);
router.route("/orders/delivery/search").get(protect, getNearByDeliveryForOrder);
router.route("/orders/delivery/assign").get(protect, assignOrder);
router.route("/orders/delivery/assign/status").get(protect, checkAssignStatus);
router.route("/order/reject").post(protect, rejectOrder);
router.route("/order/accept").post(protect, acceptOrder);
router.route("/order/ready").post(protect, readyOrder);
router.route("/restaurantReports").get(protect, getRestaurantReport);

router
  .route("/restaurantCalculatedReports")
  .get(protect, getCalculatedRestaurantReport);
  router.route("/getOrderReport").get(protect, getOrderReport);

router
.route("/payment/completed")
// .get(protect, getPaymentCompletedModel)
.post(protect, markedPaymentCompleted);
module.exports = router;
