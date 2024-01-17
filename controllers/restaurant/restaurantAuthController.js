const { verifyFirebaseToken } = require("./../../config/firebase");
const AppError = require("../../utils/appError");
const Owner = require("../../models/restaurant/ownerModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const Manager = require("../../models/restaurant/managerModel");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const Items = require("../../models/item/itemsModel");
const Version = require("../../models/versionModel");
exports.getAppVersion = catchAsync(async (req, res, next) => {
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.rpAndroidVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
});

exports.getAppIosVersion = catchAsync(async (req, res, next) => {
  // const version = "2.0.5";
  const version = await Version.findOne();
  if (version) {
    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: version.rpIosVersion,
    });
  } else {
    res.status(400).json({ status: "error", message: "Successfully" });
  }
  // res
  //   .status(200)
  //   .json({ status: "success", message: "Successfully", data: version });
});
exports.signWithGoogle = catchAsync(async (req, res, next) => {
  const { authToken, notificationToken } = req.body;
  // console.log(authToken);

  const tokenValue = await verifyFirebaseToken(authToken);
  if (tokenValue.message) {
    // console.log(tokenValue.message);
    return next(new AppError("unauthorized", 401));
  } else {
    if (tokenValue.firebase.sign_in_provider === "phone") {
      // console.log(tokenValue.phone_number);
      const owner = await Owner.findOne({
        phone: tokenValue.phone_number,
      }).populate({ path: "restaurant", populate: { path: "address" } });
      const manager = await Manager.findOne({
        phone: tokenValue.phone_number,
      }).populate("restaurant");

      if (owner) {
        for (let index = 0; index < owner.restaurant.length; index++) {
          const element = owner.restaurant[index];
          const restaurant = await Restaurant.findById(element._id);
          if (notificationToken) {
            if (!restaurant.notificationToken.includes(notificationToken)) {
              restaurant.notificationToken.push(notificationToken);
            }
          }
          await restaurant.save();
        }
        const token = createSendToken(owner);

        const cookieOptions = {
          expires: new Date(
            Date.now() +
              process.env.JWT_COOKIES_EXPIRES_IN * 24 * 62 * 62 * 1000
          ),
          httpOnly: true,
        };

        if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

        res.cookie("bearerTokenRestaurant", token, cookieOptions);
        res.status(200).json({
          status: "success",
          message: "successFully",
          user: "owner",
          token,
        });
      } else if (manager) {
        const restaurant = await Restaurant.findById(manager.restaurant._id);
        if (notificationToken) {
          if (!restaurant.notificationToken.includes(notificationToken)) {
            restaurant.notificationToken.push(notificationToken);
          }
        }
        await restaurant.save();
        const token = createSendToken(manager);
        res.status(200).json({
          status: "success",
          message: "successFully",
          user: "manager",
          token,
        });
      } else {
        return next(new AppError("user not Found ", 404));
      }
    } else {
      return next(new AppError("user not Found ", 404));
    }
  }
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (customer) => {
  return (token = signToken(customer._id));
};
exports.logOut = async (req, res) => {
  try {
    console.log("logOut");

    res
      .status(200)
      .clearCookie("bearerTokenRestaurant")
      .json({ message: "Logout successfully", status: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    let token;
    // console.log(req.headers);
    if (req.headers.cookie) {
      const value = req.headers.cookie.split("bearerTokenRestaurant=")[1];
      token = value.split(";")[0];
      // console.log(req.headers.cookie);

      // console.log(token);
      if (!token) {
        res.status(401).json({
          status: "unauthorized",
          message: "you are not logged in ! please log in to get access",
        });
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const owner = await Owner.findById(decoded.id).populate({
          path: "restaurant",
          populate: { path: "address" },
        });
        const manager = await Manager.findById(decoded.id).populate(
          "restaurant"
        );

        if (owner) {
          res.status(200).json({
            status: "success",
            message: "successFully",
            user: "owner",
            owner,
          });
        } else if (manager) {
          res.status(200).json({
            status: "success",
            message: "successFully",
            user: "manager",
            manager,
          });
        } else {
          return next(new AppError("user not Found ", 404));
        }
      }
    } else {
      res.status(404).json({ status: "not found", message: "User Not found" });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).json({
      status: "unauthorized",
      message: "you are not logged in ! please log in to get error access",
    });
  }
};
// Show separate list of restaurants based on visibility
exports.restaurantOnlineappVisible = catchAsync(async (req, res, next) => {
  try {
    const restaurantPartners = await Restaurant.find({
      appVisible: true,
      petPooja: false,
    });

    const partnerList = restaurantPartners.map((partner) => {
      return {
        restaurant_logo: partner.restaurant_logo,
        outlet_id: partner.outlet_id,
        brand_display_name: partner.brand_display_name,
        owner_name: partner.owner_name,
        outlet_name: partner.outlet_name,
        address: partner._doc.address ? partner._doc.address : "",

        business_contact: partner.business_contact,
        merchant_number: partner.merchant_number,
      };
    });

    res.status(200).json({ status: "success", data: partnerList });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Show list of restaurant partners who is using restaurant partner app
exports.restaurantOnline = catchAsync(async (req, res, next) => {
  try {
    const activeTimeFrameInDays = 30;

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - activeTimeFrameInDays);

    const restaurantPartners = await Restaurant.find({
      appVisible: true,
      petPooja: false,
      lastSeen: { $gte: currentDate },
    });

    const partnerList = restaurantPartners.map((partner) => {
      return {
        restaurant_logo: partner.restaurant_logo,
        outlet_id: partner.outlet_id,
        brand_display_name: partner.brand_display_name,
        owner_name: partner.owner_name,
        outlet_name: partner.outlet_name,
        address: partner._doc.address ? partner._doc.address : "",
        business_contact: partner.business_contact,
        merchant_number: partner.merchant_number,
        lastSeen: partner.lastSeen,
        // lastSeen: partner.formattedLastSeen,
      };
    });

    res.status(200).json({ status: "success", data: partnerList });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

exports.restaurantOflineVisible = catchAsync(async (req, res, next) => {
  try {
    const restaurantPartners = await Restaurant.find({
      appVisible: false,
      petPooja: false,
    });

    const partnerList = restaurantPartners.map((partner) => {
      return {
        restaurant_logo: partner.restaurant_logo,
        outlet_id: partner.outlet_id,
        brand_display_name: partner.brand_display_name,
        owner_name: partner.owner_name,
        outlet_name: partner.outlet_name,
        address: partner._doc.address ? partner._doc.address : "",

        business_contact: partner.business_contact,
        merchant_number: partner.merchant_number,
        lastSeen: partner.lastSeen,
      };
    });

    res.status(200).json({ status: "success", data: partnerList });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
exports.restaurantOffline = catchAsync(async (req, res, next) => {
  try {
    const offlineTimeFrameInDays = 30;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - offlineTimeFrameInDays);

    const restaurantPartners = await Restaurant.find({
      appVisible: true,
      petPooja: false,
      lastSeen: { $lt: currentDate },
    });

    const partnerList = restaurantPartners.map((partner) => {
      return {
        restaurant_logo: partner.restaurant_logo,
        outlet_id: partner.outlet_id,
        brand_display_name: partner.brand_display_name,
        owner_name: partner.owner_name,
        outlet_name: partner.outlet_name,
        address: partner._doc.address ? partner._doc.address : "",
        business_contact: partner.business_contact,
        merchant_number: partner.merchant_number,
        lastSeen: partner.lastSeen,
      };
    });

    res.status(200).json({ status: "success", data: partnerList });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
