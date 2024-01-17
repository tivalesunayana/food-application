const RestaurantPromotionBanner = require("../../models/restaurant/restaurantPromotionBannerModel");
const AdminPromotionBanner = require("./../../models/admin/adminPromotionBannerModel");

const catchAsync = require("../../utils/catchAsync");
exports.getNearestRestaurantPromotionBanner = catchAsync(
  async (req, res, next) => {
    // console.log(req.customer.currentLocation);
    // const restaurantPromotionBanner = await RestaurantPromotionBanner.aggregate(
    //   [
    //     {
    //       $geoNear: {
    //         near: {
    //           type: "Point",
    //           coordinates: req.customer.currentLocation.coordinates,
    //         },
    //         $maxDistance: 500000,
    //         spherical: true,
    //         distanceField: "distance",
    //         distanceMultiplier: 0.000621371,
    //       },
    //     },
    //     {
    //       $match: { verify: true },
    //     },
    //     { $limit: 4 },
    //   ]
    // );

    // byRestaurant
    const data = [];
    const adminPromotionBanner = await AdminPromotionBanner.find({
      visible: true,
    });
    for (let index = 0; index < adminPromotionBanner.length; index++) {
      const element = adminPromotionBanner[index];
      element.byRestaurant = false;
      data.push({
        byRestaurant: false,
        bannerImage: element.bannerImage,
        bannerName: element.bannerName,
        restaurantId: null,
      });
    }
    const restaurantPromotionBanner = await RestaurantPromotionBanner.find({
      location: {
        $near: {
          $maxDistance: 21000000000,
          $geometry: {
            type: "Point",
            coordinates: req.customer.currentLocation.coordinates,
          },
        },
      },

      verify: true,
    }).limit(4);
    for (let index = 0; index < restaurantPromotionBanner.length; index++) {
      const element = restaurantPromotionBanner[index];
      data.push({
        byRestaurant: true,
        bannerImage: element.bannerImage,
        bannerName: element.bannerName,
        restaurantId: element.restaurant,
      });
    }
    res.status(200).json({
      status: "success",
      message: "successfully",
      data,
    });
  }
);
