const express = require("express");
const router = express.Router();
const ownerOrderController = require("../../controllers/owner/ownerOrderController");
const { protect } = require("../../controllers/owner/ownerAuthController");

router.route("/orders").get(protect, ownerOrderController.getAllOrder);
router.route("/orders/delivered").get(ownerOrderController.getDeliveredOrder);
router.route("/order/reject").post(protect, ownerOrderController.rejectOrder);
router.route("/order/accept").post(protect, ownerOrderController.acceptOrder);
router.route("/order/ready").post(protect, ownerOrderController.readyOrder);

router
  .route("/order/complain")
  .get(protect, ownerOrderController.getComplain)
  .post(protect, ownerOrderController.updateComplain)
  .put(protect, ownerOrderController.getAcceptedComplain)
  .patch(protect, ownerOrderController.getComplainHistory);

router
  .route("/order/count")
  .get(protect, ownerOrderController.getAllOrderCount);

router.route("/order/call").get(protect, ownerOrderController.callCustomer);

router
  .route("/order/call/delivery")
  .get(protect, ownerOrderController.callDelivery);

router
  .route("/order/complain/history")
  .get(protect, ownerOrderController.getComplainHistory);
router
  .route("/restaurant/details")
  .get(protect, ownerOrderController.getRestaurant);

router
  .route("/coupon")
  .post(protect, ownerOrderController.createCoupon)
  // .delete(protect, ownerOrderController.deleteCoupon)
  .patch(protect, ownerOrderController.visibleCoupon)
  .get(protect, ownerOrderController.getCoupon);
// .delete(protect, ownerOrderController.deleteCoupon);
router.route("/editCoupon/:id").patch(protect, ownerOrderController.editCoupon);

router
  .route("/deleteCoupon/:couponId")
  .delete(protect, ownerOrderController.deleteCoupon);

router
  .route("/restaurants/getOrdersByTime")
  .get(protect, ownerOrderController.getRestaurantOrdersByTimePeriod);

router
  .route("/restaurants/getOrdersByDate")
  .get(protect, ownerOrderController.getRestaurantOrdersByDateRange);

module.exports = router;
