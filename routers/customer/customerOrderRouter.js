const express = require("express");
const router = express.Router();
const customerOrderController = require("../../controllers/customer/customerOrderController");
const {
  protect,
} = require("./../../controllers/customer/customerAuthController");

router.route("/order").post(protect, customerOrderController.createOrder);

router.route("/myOrders").get(protect, customerOrderController.getMyOrders);
router.route("/payment/confirm").post(customerOrderController.verifyPayment);
router.route("/order").get(protect, customerOrderController.getSingleOrder);
router
  .route("/order/payment")
  .get(protect, customerOrderController.getSingleOrderFromPaymentId);
router.route("/order/cancel").delete(customerOrderController.cancelOrder);
module.exports = router;
