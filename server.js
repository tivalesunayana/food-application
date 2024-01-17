require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketIO(server);

const logger = require("morgan");
const DBUrl = process.env.DATABASE;
const port = process.env.PORT || 9090;
const globalErrorHandler = require("./controllers/errorController");
const notFoundError = require("./utils/notFoundError");

const { connectDataBase } = require("./utils/connectDataBase");
const restaurantAuthRouter = require("./routers/restaurant/restaurantAuthRouter");

const customerAuthRouter = require("./routers/customer/customerAuthRouter");
const petPoojaRouter = require("./routers/petPoojaRouter/petPoojaRouter");
const customerRestaurantRouter = require("./routers/customer/customerRestaurantRouter");
const customerItemRouter = require("./routers/customer/customerItemRouter");
const customerCartRouter = require("./routers/customer/customerCartRouter");
const customerOrderRouter = require("./routers/customer/customerOrderRouter");
const customerPromotionBannerRouter = require("./routers/customer/customerPromotionBannerRouter");
const customerCategoryRouter = require("./routers/customer/customerCategoryRouter");
const customerBrandRouter = require("./routers/customer/customerBrandRouter");
const customerFavouriteRouter = require("./routers/customer/customerFavouriteRouter");
const customerReviewRouter = require("./routers/customer/customerReviewRouter");
const customerDeliveryRouter = require("./routers/customer/customerDeliveryRouter");
// shivam
const customerComplainRouter = require("./routers/customer/customerComplainRouter");
const customerCoinRouter = require("./routers/customer/customerCoinRouter");
const customerRefferalRouter = require("./routers/customer/customerReferralRouter");
const availableRewardsRouter = require("./routers/customer/availableRewardsRouter");
// shivam
//sanaya
const customerRedeemRouter = require("./routers/customer/customerRedeemRouter");
//sanaya
const deliveryPartnerRouter = require("./routers/deliveryPartner/deliveryPartnerRouter");
const deliveryPartnerOrderRouter = require("./routers/deliveryPartner/deliveryPartnerOrderRouter");
const deliveryPartnerVehicleRouter = require("./routers/deliveryPartner/deliveryPartnerVehicleRouter");
const deliveryPartnerAuthRouter = require("./routers/deliveryPartner/deliveryPartnerAuthRouter");
const deliveryPartnerLogRouter = require("./routers/deliveryPartner/deliveryPartnerLogRouter");
const deliveryPartnerPaymentRouter = require("./routers/deliveryPartner/deliveryPartnerPaymentRouter");
const deliveryPartnerReviewRouter = require("./routers/deliveryPartner/deliveryPartnerReviewRouter");
const deliveryPartnerReferAndEarnRouter = require("./routers/deliveryPartner/deliveryPartnerReferAndEarnRouter");
const deliveryPartnerTicketRouter = require("./routers/deliveryPartner/deliveryPartnerTicketRouter");
const deliveryPartnerNotificationRouter = require("./routers/deliveryPartner/deliveryPartnerNotificationRouter");

const ownerRestaurantRouter = require("./routers/owner/ownerRestaurantRouter");
const ownerOrderRouter = require("./routers/owner/ownerOrderRouter");
const ownerMenuItemRouter = require("./routers/owner/ownerMenuItemRouter");
const ownerTicketRouter = require("./routers/owner/ownerTicketRouter");

const adminAuthRouter = require("./routers/admin/adminAuthRouter");
const adminDashboardRouter = require("./routers/admin/adminDashboardRouter");
const adminRestaurantRouter = require("./routers/admin/adminRestaurantRouter");
const adminAsmRouter = require("./routers/admin/adminAsmRouter");
const adminOwnerRouter = require("./routers/admin/adminOwnerRouter");
const adminPromotionBannerRouter = require("./routers/admin/adminPromotionBannerRouter");
const adminCategoryRouter = require("./routers/admin/category/adminCategoryRouter");
const adminBrandRouter = require("./routers/admin/brand/adminBrandRouter");
const adminOrderRouter = require("./routers/admin/adminOrderRouter");
const adminDeliveryRouter = require("./routers/admin/adminDeliveryRouter");
const adminItemsRouter = require("./routers/admin/adminItemsRouter");
const adminCouponRouter = require("./routers/admin/adminCouponRouter");
const adminVersionRouter = require("./routers/admin/adminVersionRouter");
const adminCustomerRouter = require("./routers/admin/adminCustomerRouter");
const asmAuthRouter = require("./routers/asm/asmAuthRouter");
const asmOwnerRouter = require("./routers/asm/asmOwnerRouter");
const asmRestaurantRouter = require("./routers/asm/asmRestaurantRouter");
const adminNotificationRouter = require("./routers/admin/adminNotificationRouter");
const adminTicketRouter = require("./routers/admin/adminTicketRouter");
const adminComplainRouter = require("./routers/admin/adminComplainRouter");

// shivam
const adminActiveCustomerRouter = require("./routers/admin/adminActiveCustomerRouter");
const adminRedeemRewardRouter = require("./routers/admin/adminRedeemRewardRouter");
const adminReferralRouter = require("./routers/admin/referralRouter/adminReferralRouter");
// shivam

connectDataBase(DBUrl); // connect data base
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1024MB" }));
app.use(express.static(path.join(__dirname, "build")));

// admin route
app.use("/api/v1/admin", adminDashboardRouter);
app.use("/api/v1/admin", adminRestaurantRouter);
app.use("/api/v1/admin", adminAuthRouter);
app.use("/api/v1/admin", adminAsmRouter);
app.use("/api/v1/admin", adminOwnerRouter);
app.use("/api/v1/admin", adminPromotionBannerRouter);
app.use("/api/v1/admin", adminCategoryRouter);
app.use("/api/v1/admin", adminBrandRouter);
app.use("/api/v1/admin", adminOrderRouter);
app.use("/api/v1/admin", adminDeliveryRouter);
app.use("/api/v1/admin", adminNotificationRouter);
app.use("/api/v1/admin", adminItemsRouter);
app.use("/api/v1/admin", adminCouponRouter);
app.use("/api/v1/admin", adminVersionRouter);
app.use("/api/v1/admin", adminTicketRouter);
app.use("/api/v1/admin", adminCustomerRouter);
app.use("/api/v1/admin", adminComplainRouter);
// shivam
app.use("/api/v1/admin", adminActiveCustomerRouter);
app.use("/api/v1/admin", adminRedeemRewardRouter);
app.use("/api/v1/admin", adminReferralRouter); //working on this
// shivam

app.use("/api/v1.0.1/owner", ownerRestaurantRouter);
app.use("/api/v1.0.1/owner", ownerOrderRouter);
app.use("/api/v1.0.1/owner", ownerMenuItemRouter);
app.use("/api/v1.0.1/owner", ownerTicketRouter);

app.use("/api/v1.0.1/customer", customerAuthRouter);
app.use("/api/v1/customer", customerAuthRouter);
app.use("/api/v1.0.1/customer", customerRestaurantRouter);
app.use("/api/v1.0.1/customer", customerItemRouter);
app.use("/api/v1.0.1/customer", customerCartRouter);
app.use("/api/v1.0.1/customer", customerOrderRouter);
app.use("/api/v1.0.1/customer", customerPromotionBannerRouter);
app.use("/api/v1.0.1/customer", customerCategoryRouter);
app.use("/api/v1.0.1/customer", customerBrandRouter);
app.use("/api/v1.0.1/customer", customerFavouriteRouter);
app.use("/api/v1.0.1/customer", customerReviewRouter);
app.use("/api/v1.0.1/customer", customerDeliveryRouter);

// shivam
app.use("/api/v1.0.1/customer", customerComplainRouter);
app.use("/api/v1.0.1/customer", customerCoinRouter);
app.use("/api/v1.0.1/customer", customerRefferalRouter);
app.use("/api/v1.0.1/customer", availableRewardsRouter);
// shivam
// sanayana
app.use("/api/v1.0.1/customer", customerRedeemRouter);
// sanayana
const ownerAuthRouter = require("./routers/owner/ownerAuthRouter");

app.use(
  "/api/v1.0.1/petPooja",
  express.json({ limit: "1024MB" }),
  petPoojaRouter
);

app.use("/api/v1.0.1/asm", asmAuthRouter);
app.use("/api/v1.0.1/asm", asmOwnerRouter);
app.use("/api/v1.0.1/asm", asmRestaurantRouter);

app.use("/api/v1.0.1/delivery/partner", deliveryPartnerAuthRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerOrderRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerVehicleRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerLogRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerPaymentRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerReviewRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerReferAndEarnRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerTicketRouter);
app.use("/api/v1.0.1/delivery/partner", deliveryPartnerNotificationRouter);

app.use("/api/v1.0.1/owner", ownerAuthRouter);

app.use("/api/v1.0.1/restaurant", restaurantAuthRouter);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(globalErrorHandler); // global error handler
app.use("/", notFoundError); // Not found error handler

server.listen(port, () =>
  console.log(`ybites server is listening on port ${port}!`)
);
