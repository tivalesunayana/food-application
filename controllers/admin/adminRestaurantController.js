const BankDetail = require("../../models/payment/bankDetailModel");
const catchAsync = require("../../utils/catchAsync");
const Restaurant = require("./../../models/restaurant/restaurantModel");
// const Document = require("../../models/document/documentModel");
const AppError = require("../../utils/appError");
const { uploadImg } = require("../../config/s3config");

// const MenuItem = require("../../models/menuItem/menuItemModel");
// const MenuCategory = require("../../models/menuItem/menuItemCategoryModel");
// const MenuSubCategory = require("../../models/menuItem/menuItemSubCategoryModel");
// const MenuItemTiming = require("../../models/menuItem/menuItemTimingModel");
const Address = require("../../models/address/addressModel");
const Owner = require("../../models/restaurant/ownerModel");
// const RestaurantStatusModel = require("../../models/restaurant/restaurantStatusModel");
// const RestaurantTiming = require("../../models/restaurant/restaurantTimingModel");
const Order = require("../../models/order/orderModel");
const moment = require("moment/moment");
const { default: mongoose } = require("mongoose");

const get1min = () => {
  const d = new Date();
  return new Date(d.getTime() - 10000 * 60000);
};
//harshdeep code
// exports.getRestaurantUnapproved = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const restaurant = await Restaurant.find({ approved: false, petPooja: false })
//     .populate("items")
//     .populate("attributes")
//     .populate("bankDetail")
//     .populate("taxes")
//     .populate({ path: "asm", select: "name" })
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Restaurant.count({ approved: false, petPooja: false });
//   res
//     .status(200)
//     .json({ restaurant, total, status: "success", message: "successfully" });
// });
exports.getRestaurantUnapproved = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, city } = req.query;
  const skip = page * limit - limit;

  const query = {
    approved: false,
    petPooja: false,
    ...(city && { city: new RegExp(`^${city.trim()}$`, "i") }),
  };

  const restaurant = await Restaurant.find(query)
    .populate("items")
    .populate("attributes")
    .populate("bankDetail")
    .populate("taxes")
    .populate({ path: "asm", select: "name" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count(query);

  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});

//harshdeep code
// exports.getRestaurantApproved = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const restaurant = await Restaurant.find({ approved: true, petPooja: false })
//     .populate("items")
//     .populate("attributes")
//     .populate("bankDetail")
//     .populate("taxes")
//     .populate("status")

//     .populate({ path: "asm", select: "name" })

//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Restaurant.count({ approved: true, petPooja: false });
//   res
//     .status(200)
//     .json({ restaurant, total, status: "success", message: "successfully" });
// });
// exports.getRestaurantApproved = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field, city } = req.query;
//   const skip = page * limit - limit;

//   let filter = {
//     approved: true,
//     petPooja: false,
//   };

//   if (city) {
//     const cityRegex = new RegExp(`^${city.trim()}$`, "i");
//     filter.city = cityRegex;
//   }

//   const restaurant = await Restaurant.find(filter)
//     .populate("items")
//     .populate("attributes")
//     .populate("bankDetail")
//     .populate("taxes")
//     .populate("status")
//     .populate({ path: "asm", select: "name" })
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Restaurant.count(filter);

//   res
//     .status(200)
//     .json({ restaurant, total, status: "success", message: "successfully" });
// });
exports.getRestaurantApproved = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, city } = req.query;
  const skip = page * limit - limit;

  const query = {
    approved: true,
    petPooja: false,
    ...(city && { city: new RegExp(`^${city.trim()}$`, "i") }),
  };

  const restaurant = await Restaurant.find(query)
    .populate("items")
    .populate("attributes")
    .populate("bankDetail")
    .populate("taxes")
    .populate("status")
    .populate({ path: "asm", select: "name" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count(query);

  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});

exports.searchApprovedRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: true,
    petPooja: false,
  })
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .populate("bankDetail")

    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.searchUnapprovedPetPetPoojaRestaurant = catchAsync(
  async (req, res, next) => {
    const { query } = req.query;
    const data = await Restaurant.find({
      brand_display_name: { $regex: new RegExp(query, "i") },
      approved: false,
      petPooja: true,
    })
      .populate("items")
      .populate("attributes")
      .populate("taxes")

      .populate("bankDetail")

      .limit(10);

    res.status(200).json({
      status: "success",
      message: "successful",
      data,
    });
  }
);

exports.getPetPoojaRestaurants = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const restaurant = await Restaurant.find({ approved: true, petPooja: true })
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count({ approved: true, petPooja: true });
  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});

exports.getRestaurantOrdersByTimePeriod = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, timePeriod, restaurantId } = req.query;

  // const skip = page && limit ? (page - 1) * limit : 0;

  let startDate, endDate;

  if (timePeriod === "today") {
    const currentDate = new Date();
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999
    );
  } else if (timePeriod === "week") {
    const currentDate = new Date();
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 6
    );
  } else if (timePeriod === "month") {
    const currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid time period" });
  }

  const order = await Order.find({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    createdAt: { $gte: startDate, $lte: endDate },
  });

  if (!order) {
    return res
      .status(404)
      .json({ status: "not found", message: "No orders found" });
  }

  const total = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    createdAt: { $gte: startDate, $lte: endDate },
  });

  res
    .status(200)
    .json({ data: order, total, status: "success", message: "successfully" });
});
// exports.getRestaurantOrdersByDateRange = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field, startDate, endDate, restaurantId } =
//     req.query;

//   if (!startDate || !endDate) {
//     return res.status(400).json({
//       status: "error",
//       message: "Both start date and end date are required",
//     });
//   }

//   const startDateTime = new Date(startDate);
//   const endDateTime = new Date(endDate);

//   if (startDateTime >= endDateTime) {
//     return res.status(400).json({
//       status: "error",
//       message: "Start date must be earlier than end date",
//     });
//   }

//   const order = await Order.find({
//     restaurant: restaurantId,
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//     createdAt: { $gte: startDateTime, $lte: endDateTime },
//   });

//   if (!order) {
//     return res
//       .status(404)
//       .json({ status: "not found", message: "No orders found" });
//   }

//   const total = await Order.count({
//     restaurant: restaurantId,
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//     createdAt: { $gte: startDateTime, $lte: endDateTime },
//   });

//   res
//     .status(200)
//     .json({ data: order, total, status: "success", message: "successfully" });
// });
exports.getRestaurantOrdersByDateRange = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, startDate, endDate, restaurantId } =
    req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      status: "error",
      message: "Both start date and end date are required",
    });
  }

  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  if (startDateTime >= endDateTime) {
    return res.status(400).json({
      status: "error",
      message: "Start date must be earlier than end date",
    });
  }

  const order = await Order.find({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    createdAt: { $gte: startDateTime, $lte: endDateTime },
  });
  console.log(`data :${order}`);
  console.log(`id :${order.restaurant}`);

  if (!order) {
    return res
      .status(404)
      .json({ status: "not found", message: "No orders found" });
  }

  const total = await Order.count({
    restaurant: restaurantId,
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
    createdAt: { $gte: startDateTime, $lte: endDateTime },
  });

  res
    .status(200)
    .json({ data: order, total, status: "success", message: "successfully" });
});

exports.searchPetPoojaRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: true,
    petPooja: true,
  })
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .populate("bankDetail")

    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.unapprovedPetPetPoojaRestaurants = catchAsync(
  async (req, res, next) => {
    const { page, limit, sort, field } = req.query;
    const skip = page * limit - limit;

    const restaurant = await Restaurant.find({
      approved: false,
      petPooja: true,
    })
      .populate("items")
      .populate("attributes")
      .populate("taxes")

      .sort(
        field
          ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
          : {}
      )
      .limit(limit || 10)
      .skip(skip);

    const total = await Restaurant.count({ approved: false, petPooja: true });
    res
      .status(200)
      .json({ restaurant, total, status: "success", message: "successfully" });
  }
);

exports.approveRestaurant = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const restaurant = await Restaurant.findById(restaurantId)
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .populate("bankDetail");

  // if (!restaurant.bankDetail.verified) {
  //   return next(new AppError("bankDetail is not Verify", 409));
  // }
  if (!(restaurant.res_timings.length === 7)) {
    return next(new AppError("Restaurant timings is not Set", 409));
  }
  restaurant.approved = true;
  await restaurant.save();
  res
    .status(200)
    .json({ restaurant, status: "success", message: "successfully" });
});

exports.approveRestaurantPetPooja = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const restaurant = await Restaurant.findById(restaurantId)
    .populate("items")
    .populate("attributes")
    .populate("taxes");

  if (!(restaurant.res_timings.length === 7)) {
    return next(new AppError("restaurant timings is not Set", 409));
  }
  restaurant.approved = true;
  await restaurant.save();
  res
    .status(200)
    .json({ restaurant, status: "success", message: "successfully" });
});

exports.approveRestaurantDocument = catchAsync(async (req, res, next) => {
  const { documentId } = req.query;
  const document = await Document.findById(documentId);
  document.verified = true;
  await document.save();
  res
    .status(200)
    .json({ status: "success", message: "Document verify successfully" });
});

exports.approveRestaurantBank = catchAsync(async (req, res, next) => {
  const { bankDetailId } = req.query;
  const bankDetail = await BankDetail.findById(bankDetailId);
  bankDetail.verified = true;
  await bankDetail.save();
  res
    .status(200)
    .json({ status: "success", message: "BankDetail verify successfully" });
});

exports.appVisibleRestaurantBank = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { appVisible } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.appVisible = appVisible;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "restaurant app visible updated successfully",
  });
});

exports.getUnapprovedMenuItem = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = page * limit - limit;
  const menuItem = await Items.find({ approved: false })
    .limit(limit || 10)
    .skip(skip)
    .populate("restaurant")
    .populate("cuisine")
    .populate("category")
    .populate({ path: "customizations", populate: "customizationItems" })
    .populate({ path: "addOns", populate: "addOnItems" })
    .populate({ path: "options", populate: "optionItems" });

  const total = await Items.find({ approved: false });
  res.status(200).json({
    menuItem,
    total,
    status: "success",
    message: "successfully",
  });
});

exports.approveRestaurantMenuItem = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const menuItem = await MenuItem.findById(menuItemId);
  menuItem.approved = true;
  await menuItem.save();
  res.status(200).json({
    menuItem,
    status: "success",
    message: "menuItem approved successfully",
  });
});

exports.getMenuItem = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const menuCategory = await MenuCategory.find({
    restaurant: restaurantId,
    // approved: true,
  })
    .populate({
      path: "menuSubCategories",
      populate: {
        path: "menuItems",
        populate: [
          { path: "customizations", populate: "customizationItems" },
          { path: "addOns", populate: "addOnItems" },
          { path: "options", populate: "optionItems" },
          { path: "timing" },
        ],
      },
    })
    .populate({
      path: "menuItems",
      populate: [
        { path: "customizations", populate: "customizationItems" },
        { path: "addOns", populate: "addOnItems" },
        { path: "options", populate: "optionItems" },
        { path: "timing" },
      ],
    });
  res.status(200).json({
    data: menuCategory,
    status: "success",
    message: "successfully",
  });
});

exports.getUnVariatedMenuItem = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const menuItems = await MenuItem.find({ approved: false })
    .populate({ path: "customizations", populate: "customizationItems" })
    .populate({ path: "addOns", populate: "addOnItems" })
    .populate({ path: "options", populate: "optionItems" })
    .populate({ path: "timing" })
    .populate({ path: "restaurant" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);
  const total = await MenuItem.count({ approved: false });
  res.status(200).json({
    status: "success",
    message: "successful",
    total,
    menuItems,
  });
});


exports.searchBhiwandiRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: true,
    petPooja: false,
    city:"Bhiwandi"
  })
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .populate("bankDetail")

    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});



exports.searchBRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: true,
    petPooja: false,
    city:"Bhiwandi"
  })
    .populate("bankDetail")
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});
exports.searchRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: true,
    petPooja: false,
  })
    .populate("bankDetail")
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.searchUnapprovedRestaurant = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const data = await Restaurant.find({
    brand_display_name: { $regex: new RegExp(query, "i") },
    approved: false,
    petPooja: false,
  })
    .populate("items")
    .populate("attributes")
    .populate("taxes")

    .populate("bankDetail")

    .limit(10);

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.createMenuItemWithCSV = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { menuJson } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("Restaurant not found", 409));
  }
  for (let index = 0; index < menuJson.length; index++) {
    const element = menuJson[index];
    const menuCategory = await MenuCategory.findOne({
      restaurant: restaurant._id,
      title: element.menuCategory,
    });
    if (menuCategory) {
      if (element.menuSubCategory) {
        const menuSubCategory = await MenuSubCategory.findOne({
          menuCategory: menuCategory._id,
          title: element.menuCategory,
        });
        if (!menuSubCategory) {
          const newMenuSabCategory = await MenuSubCategory.create({
            menuCategory: menuCategory._id,
            title: element.menuCategory,
          });
          const menuItem = await MenuItem.create({
            title: element.title,
            approved: true,
            menuItemType: element.menuItemType,
            description: element.description,
            discount: 0,
            price: element.price * 1,
            unitPrice: element.unitPrice * 1,
            preparationTime: element.preparationTime * 1,
            restaurant: restaurantId,
            menuSubCategory: newMenuSabCategory._id,
            menuCategory: menuCategory._id,
          });
          const menuItemTiming = await MenuItemTiming.create({
            menuItem: menuItem._id,
          });

          menuItem.timing = menuItemTiming._id;
          await menuItem.save();
          newMenuSabCategory.menuItems.push(menuItem._id);
          restaurant.menuItems.push(menuItem._id);
          await newMenuSabCategory.save();
        } else {
          const menuItem = await MenuItem.create({
            title: element.title,
            approved: true,
            menuItemType: element.menuItemType,
            description: element.description,
            discount: 0,
            price: element.price * 1,
            unitPrice: element.unitPrice * 1,
            preparationTime: element.preparationTime * 1,
            restaurant: restaurantId,
            menuSubCategory: menuSubCategory._id,
            menuCategory: menuCategory._id,
          });
          menuSubCategory.menuItems.push(menuItem._id);
          restaurant.menuItems.push(menuItem._id);
          const menuItemTiming = await MenuItemTiming.create({
            menuItem: menuItem._id,
          });

          menuItem.timing = menuItemTiming._id;
          await menuItem.save();
          await menuSubCategory.save();
        }
      } else {
        const menuItem = await MenuItem.create({
          title: element.title,
          approved: true,
          menuItemType: element.menuItemType,
          description: element.description,
          discount: 0,
          price: element.price * 1,
          unitPrice: element.unitPrice * 1,
          preparationTime: element.preparationTime * 1,
          restaurant: restaurantId,
          // menuSubCategory:menuSubCategory._id,
          menuCategory: menuCategory._id,
        });
        menuCategory.menuItems.push(menuItem._id);
        restaurant.menuItems.push(menuItem._id);
        const menuItemTiming = await MenuItemTiming.create({
          menuItem: menuItem._id,
        });

        menuItem.timing = menuItemTiming._id;
        await menuItem.save();
        await menuCategory.save();
      }
    } else {
      const newMenuCategory = await MenuCategory.create({
        restaurant: restaurant._id,
        title: element.menuCategory,
      });
      if (element.menuSubCategory) {
        const menuSubCategory = await MenuSubCategory.findOne({
          menuCategory: newMenuCategory._id,
          title: element.menuCategory,
        });
        if (!menuSubCategory) {
          const newMenuSabCategory = await MenuSubCategory.create({
            menuCategory: newMenuCategory._id,
            title: element.menuCategory,
          });
          const menuItem = await MenuItem.create({
            title: element.title,
            approved: true,
            menuItemType: element.menuItemType,
            description: element.description,
            discount: 0,
            price: element.price * 1,
            unitPrice: element.unitPrice * 1,
            preparationTime: element.preparationTime * 1,
            restaurant: restaurantId,
            menuSubCategory: newMenuSabCategory._id,
            menuCategory: newMenuCategory._id,
          });
          newMenuSabCategory.menuItems.push(menuItem._id);
          restaurant.menuItems.push(menuItem._id);
          const menuItemTiming = await MenuItemTiming.create({
            menuItem: menuItem._id,
          });

          menuItem.timing = menuItemTiming._id;
          await menuItem.save();
          await newMenuSabCategory.save();
        } else {
          const menuItem = await MenuItem.create({
            title: element.title,
            approved: true,
            menuItemType: element.menuItemType,
            description: element.description,
            discount: 0,
            price: element.price * 1,
            unitPrice: element.unitPrice * 1,
            preparationTime: element.preparationTime * 1,
            restaurant: restaurantId,
            menuSubCategory: menuSubCategory._id,
            menuCategory: newMenuCategory._id,
          });
          menuSubCategory.menuItems.push(menuItem._id);
          restaurant.menuItems.push(menuItem._id);
          const menuItemTiming = await MenuItemTiming.create({
            menuItem: menuItem._id,
          });

          menuItem.timing = menuItemTiming._id;
          await menuItem.save();
          await menuSubCategory.save();
        }
      } else {
        const menuItem = await MenuItem.create({
          title: element.title,
          approved: true,
          menuItemType: element.menuItemType,
          description: element.description,
          discount: 0,
          price: element.price * 1,
          unitPrice: element.unitPrice * 1,
          preparationTime: element.preparationTime * 1,
          restaurant: restaurantId,

          menuCategory: newMenuCategory._id,
        });
        newMenuCategory.menuItems.push(menuItem._id);
        restaurant.menuItems.push(menuItem._id);
        const menuItemTiming = await MenuItemTiming.create({
          menuItem: menuItem._id,
        });

        menuItem.timing = menuItemTiming._id;
        await menuItem.save();
        await newMenuCategory.save();
      }
    }
  }
  await restaurant.save();
  // console.log(menuJson);

  res.status(200).json({ status: "success", message: "Menu has been created" });
});

exports.editRestaurant = catchAsync(async (req, res, next) => {
  const {
    brand_display_name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    note,
    pincode,
    cuisines,
    city,
    business_contact,
    merchant_number,
    email,
    longitude,
    latitude,
    _id,
  } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(_id, {
    brand_display_name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    pincode,
    note,
    cuisines: cuisines.toString(),

    city,
    business_contact,
    merchant_number,
    email,
    location: { type: "Point", coordinates: [longitude, latitude] },
  });

  res.status(200).json({
    status: "success",
    message: " Restaurant Edited Successfully",
    data: restaurant,
  });
});

exports.editRestaurantLocation = catchAsync(async (req, res, next) => {
  const { longitude, latitude, _id } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(_id, {
    location: { type: "Point", coordinates: [longitude, latitude] },
  });

  res.status(200).json({
    status: "success",
    message: " Restaurant location updated Successfully",
    data: restaurant,
  });
});

exports.getOnlineRestaurant = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const restaurantStatusModel = await RestaurantStatusModel.find({
    updatedAt: { $gt: new Date(get1min()) },
  });
  const restaurantIds = [];
  for (let index = 0; index < restaurantStatusModel.length; index++) {
    const element = restaurantStatusModel[index];
    restaurantIds.push(element.restaurant);
  }
  console.log(`testing :${restaurantIds}`);
  const restaurant = await Restaurant.find({
    _id: { $in: restaurantIds },
    approved: true,
  })
    // .populate("fssaiCertificate")
    // .populate("gstCertificate")
    // .populate("menuItems")
    // .populate("owner")
    // .populate("items")
    // .populate("bankDetail")
    // .populate("address")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);
  console.log(`testing restaurant:${restaurant}`);

  console.log(`testing :${restaurantIds}`);

  const total = await Restaurant.count({
    approved: true,
    _id: { $in: restaurantIds },
  });
  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});

exports.restaurantTiming = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const checkTiming = await RestaurantTiming.findOne({
    restaurant: restaurant._id,
  });
  if (checkTiming) {
    if (sunday) {
      checkTiming.sunday = sunday;
    }
    if (monday) {
      checkTiming.monday = monday;
    }
    if (tuesday) {
      checkTiming.tuesday = tuesday;
    }
    if (wednesday) {
      checkTiming.wednesday = wednesday;
    }
    if (thursday) {
      checkTiming.thursday = thursday;
    }
    if (friday) {
      checkTiming.friday = friday;
    }
    if (saturday) {
      checkTiming.saturday = saturday;
    }
    await checkTiming.save();
  } else {
    const createTiming = await RestaurantTiming.create({
      restaurant: restaurant._id,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
    restaurant.timing = createTiming._id;
    await restaurant.save();
  }
  res
    .status(200)
    .json({ status: "success", message: "timing created successfully" });
});

// exports.getRestaurantReport = catchAsync (async (req,res,next)=>{
//   const date = new Date(new Date().setMilliseconds(-(7 * 24 * 60 * 60 * 1000)));
//   const endDate = new Date();
//   const startDate = new Date(
//     new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
//     // .setMilliseconds(+(330 * 60 * 1000))
//   );

//   const order = await Order.aggregate([
//     {
//       $match: {
//         createdAt: { $gte: startDate, $lt: endDate },
//         deliveryPartner: new mongoose.Types.ObjectId(req.deliveryPartner._id),
//       },
//     },
//     {
//       $addFields: {
//         createdAt: {
//           $dateFromParts: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" },
//           },
//         },
//         dateRange: {
//           $map: {
//             input: {
//               $range: [
//                 0,
//                 { $subtract: [endDate, startDate] },
//                 1000 * 60 * 60 * 24,
//               ],
//             },
//             in: { $add: [startDate, "$$this"] },
//           },
//         },
//       },
//     },
//     { $unwind: "$dateRange" },
//     {
//       $group: {
//         _id: "$dateRange",

//         order: {
//           $push: {
//             $cond: [
//               { $eq: ["$dateRange", "$createdAt"] },
//               {
//                 deliveryShare: "$deliveryShare",
//                 orderId: "$orderId",
//               },
//               "$$REMOVE",
//             ],
//           },
//         },
//       },
//     },
//     { $sort: { _id: -1 } },
//     { $addFields: { total: { $sum: "$order.deliveryShare" } } },
//     // { $addFields: { date: { $sum: "$_id" } } },
//     {
//       $project: {
//         date: "$_id",
//         order: "$order",
//         total: "$total",
//       },
//     },
//   ]);
// })

exports.getRestaurantReport = catchAsync(async (req, res, next) => {
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const restaurantId = req.body.restaurantId;
  console.log(`startDate:${startDate}`);
  console.log(`endDate:${endDate}`);

  console.log(startDate - endDate);
  function toHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  const finalData = [];
  const restaurants = await Restaurant.find({ approved: true })
    .populate("bankDetail")
    .populate("petPooja")
    .populate("taxes")
    .populate("items")
    .populate("ordertypes");
  console.log(`restaurants data :${restaurants}`);

  // console.log(
  //   await Order.find({
  //     createdAt: { $gte: startDate, $lte: endDate },
  //     status: "Delivered",
  //   })
  // );

  // const order2 = await Order.aggregate([
  //   {
  //     $match: {
  //       // createdAt: { $gte: startDate, $lte: endDate },
  //       // restaurant: new mongoose.Types.ObjectId(restaurant._id),
  //       status: "Delivered",
  //     },
  //   },

  //   {
  //     $lookup: {
  //       from: "orderitems",
  //       localField: "orderItems",
  //       foreignField: "_id",

  //       as: "orderItems",
  //     },
  //   },

  //   {
  //     $addFields: {
  //       createdAt: {
  //         $dateFromParts: {
  //           year: { $year: "$createdAt" },
  //           month: { $month: "$createdAt" },
  //           day: { $dayOfMonth: "$createdAt" },
  //         },
  //       },
  //       dateRange: {
  //         $map: {
  //           input: {
  //             $range: [
  //               0,
  //               { $subtract: [endDate, startDate] },
  //               1000 * 60 * 60 * 24,
  //             ],
  //           },
  //           in: { $add: [startDate, "$$this"] },
  //         },
  //       },
  //     },
  //   },
  //   { $unwind: "$dateRange" },
  //   {
  //     $group: {
  //       _id: "$dateRange",

  //       order: {
  //         $push: {
  //           $cond: [
  //             { $eq: ["$dateRange", "$createdAt"] },
  //             {
  //               orderItems: "$orderItems",
  //               order: "$order",
  //               paymentMode: "$paymentMode",
  //               orderId: "$orderId",
  //               deliveryCharge: "$deliveryCharge",
  //               grandTotalPrice: "$grandTotalPrice",
  //               totalPrice: "$totalPrice",
  //               totalTaxes: "$totalTaxes",
  //               grandTotalTaxes: "$grandTotalTaxes",
  //               packagingCharge: "$packagingCharge",
  //               discount: "$discount",
  //               paymentAmount: "$paymentAmount",
  //               deliveryBoyShare: "$deliveryBoyShare",
  //               yBitesEarning: "$yBitesEarning",
  //               deliveryShare: "$deliveryShare",
  //               yBitesDeliveryShare: "$yBitesDeliveryShare",

  //               status: "$status",
  //             },

  //             "$$REMOVE",
  //           ],
  //         },
  //       },
  //     },
  //   },
  //   { $sort: { _id: -1 } },
  //   { $addFields: { total: { $sum: "$order.paymentAmount" } } },
  //   {
  //     $project: {
  //       // date: "$_id",
  //       order: "$order",
  //       total: "$total",
  //     },
  //   },
  // ]);
  // console.log(order2);
  for (let l = 0; l < restaurants.length; l++) {
    const restaurant = restaurants[l];
    const order = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          restaurant: new mongoose.Types.ObjectId(restaurant._id),
          status: "Delivered",
        },
      },

      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",

          as: "orderItems",
        },
      },

      {
        $addFields: {
          createdAt: {
            $dateFromParts: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
          },
          dateRange: {
            $map: {
              input: {
                $range: [
                  0,
                  { $subtract: [endDate, startDate] },
                  1000 * 60 * 60 * 24,
                ],
              },
              in: { $add: [startDate, "$$this"] },
            },
          },
        },
      },
      { $unwind: "$dateRange" },
      {
        $group: {
          _id: "$dateRange",

          order: {
            $push: {
              $cond: [
                { $eq: ["$dateRange", "$createdAt"] },
                {
                  orderItems: "$orderItems",
                  order: "$order",
                  paymentMode: "$paymentMode",
                  orderId: "$orderId",
                  deliveryCharge: "$deliveryCharge",
                  grandTotalPrice: "$grandTotalPrice",
                  totalPrice: "$totalPrice",
                  totalTaxes: "$totalTaxes",
                  grandTotalTaxes: "$grandTotalTaxes",
                  packagingCharge: "$packagingCharge",
                  discount: "$discount",
                  paymentAmount: "$paymentAmount",
                  deliveryBoyShare: "$deliveryBoyShare",
                  yBitesEarning: "$yBitesEarning",
                  deliveryShare: "$deliveryShare",
                  yBitesDeliveryShare: "$yBitesDeliveryShare",

                  status: "$status",
                },

                "$$REMOVE",
              ],
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      { $addFields: { total: { $sum: "$order.paymentAmount" } } },
      {
        $project: {
          // date: "$_id",
          order: "$order",
          total: "$total",
        },
      },
    ]);
    // console.log(order);
    console.log(`order data :${order}`);

    const data = [];
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      if (!(element.order.length === 0)) {
        const orderData = [];
        for (let j = 0; j < element.order.length; j++) {
          const element2 = element.order[j];
          const itemTitle =
            element2.orderItems.length === 1
              ? element2.orderItems[0].itemTitle
              : `${element2.orderItems[0].itemTitle} + ${
                  element2.orderItems.length - 1
                }`;
          element2.orderItems = undefined;

          orderData.push({
            order: { ...element2, itemTitle },
          });
        }
        const dd = {
          date: moment(element._id).format("DD/MM/YYYY"),
          order: orderData,
        };
        data.push(dd);
      }
    }
    if (data.length !== 0) {
      finalData.push({
        ...restaurant.toObject({ getters: true }),
        orders: data,
      });
    }
  }
  res.status(200).json({
    status: "success",
    message: "successful",
    data: finalData,
  });
});
exports.getRestaurantReports = catchAsync(async (req, res, next) => {
  const finalData = [];
  const restaurants = await Restaurant.find({ approved: true })
    .populate("bankDetail")
    .populate("petPooja")
    .populate("taxes")
    .populate("items")
    .populate("ordertypes");
  console.log(`restaurants data :${restaurants}`);
  for (let l = 0; l < restaurants.length; l++) {
    const restaurant = restaurants[l];
    console.log(`restaurant id:${restaurant._id}`);
    console.log(`restaurant name ----: ${restaurant.brand_display_name}`);
    const order = await Order.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurant._id),
          status: "Delivered",
        },
      },

      {
        $lookup: {
          from: "orderitems",
          localField: "orderItems",
          foreignField: "_id",
          as: "orderItems",
        },
      },

      {
        $addFields: {
          createdAt: {
            $dateFromParts: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
          },
        },
      },
      {
        $group: {
          _id: "$createdAt",
          order: {
            $push: {
              orderItems: "$orderItems",
              order: "$order",
              paymentMode: "$paymentMode",
              orderId: "$orderId",
              deliveryCharge: "$deliveryCharge",
              grandTotalPrice: "$grandTotalPrice",
              totalPrice: "$totalPrice",
              totalTaxes: "$totalTaxes",
              grandTotalTaxes: "$grandTotalTaxes",
              packagingCharge: "$packagingCharge",
              discount: "$discount",
              paymentAmount: "$paymentAmount",
              deliveryBoyShare: "$deliveryBoyShare",
              yBitesEarning: "$yBitesEarning",
              deliveryShare: "$deliveryShare",
              yBitesDeliveryShare: "$yBitesDeliveryShare",
              status: "$status",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      { $addFields: { total: { $sum: "$order.paymentAmount" } } },
      {
        $project: {
          order: "$order",
          total: "$total",
        },
      },
    ]);
    console.log(`order data :${order}`);

    const data = [];
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      if (!(element.order.length === 0)) {
        const orderData = [];
        for (let j = 0; j < element.order.length; j++) {
          const element2 = element.order[j];
          const itemTitle =
            element2.orderItems.length === 1
              ? element2.orderItems[0].itemTitle
              : `${element2.orderItems[0].itemTitle} + ${
                  element2.orderItems.length - 1
                }`;
          element2.orderItems = undefined;

          orderData.push({
            order: { ...element2, itemTitle },
          });
        }
        console.log(`orderData data :${orderData}`);

        const dd = {
          date: moment(element._id).format("DD/MM/YYYY"),
          order: orderData,
        };
        data.push(dd);
      }
    }
    console.log(`data data :${data}`);

    if (data.length !== 0) {
      finalData.push({
        ...restaurant.toObject({ getters: true }),
        orders: data,
      });
    }
  }
  res.status(200).json({
    status: "success",
    message: "successful",
    data: finalData,
  });
});

// onboarding

const Taxes = require("../../models/item/taxesModel");
const Attributes = require("../../models/item/attributesModel");
const Items = require("../../models/item/itemsModel");
const ASM = require("../../models/asm/asmModel");
const RestaurantStatusModel = require("../../models/restaurant/restaurantStatusModel");
const OrderReportCalculation = require("../../models/restaurant/OrderReportsCalculation");
const BhiwandiOrderReport = require("../../models/restaurant/bhiwandiOrderReport");
const Coupon = require("../../models/offer/couponModal");
const OrderItem = require("../../models/order/orderItem");
exports.uploadMenuItemsFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }
  const response = await uploadImg(file);
  const { restaurantId } = req.query;

  const restaurant = await Restaurant.findById(restaurantId);

  restaurant.menuItemsFile = response.Key;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant menu item file upload successfully",
  });
});
exports.createRestaurant = catchAsync(async (req, res, next) => {
  const {
    brand_display_name,
    outlet_name,
    ownerId,
    address,
    landmark,
    area,
    state,
    pincode,
    note,
    city,
    business_contact,
    merchant_number,
    email,
    cuisines,
    longitude,
    latitude,
  } = req.body;
  if (!(longitude && latitude)) {
    return next(
      new AppError("name  or longitude or latitude are messing", 404)
    );
  }
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    new AppError("Owner id is required ", 404);
  }
  const restaurant = await Restaurant.create({
    admin: req.admin._id,
    brand_display_name,
    owner_name: owner.name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    pincode,
    note,
    city,
    business_contact,
    merchant_number,
    email,
    cuisines,
    location: { type: "Point", coordinates: [longitude, latitude] },
    owner: owner._id,
    petPooja: false,
    approved: false,
    appVisible: false,
  });
  restaurant.outlet_id = restaurant._id.toString();
  owner.restaurant.push(restaurant._id);
  await owner.save();
  const taxes = [
    { taxname: "SGST", tax: "2.5" },
    { taxname: "CGST", tax: "2.5" },
    { taxname: "SGST", tax: "9" },
    { taxname: "CGST", tax: "9" },
  ];
  for (let index = 0; index < taxes.length; index++) {
    const element = taxes[index];
    const tax = await Taxes.create({
      taxname: element.taxname,
      tax: element.tax,
      restaurant: restaurant._id,
      active: "1",
    });
    restaurant.taxes.push(tax._id);
    tax.taxid = tax._id.toString();
    await tax.save();
  }

  await restaurant.save();

  res.status(200).json({
    data: restaurant,
    status: "success",
    message: "Restaurant created successfully",
  });
});

exports.createAndUploadFssai = catchAsync(async (req, res, next) => {
  const { restaurantId, fssai_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!fssai_no) {
    return new AppError("No fssai_no found", 404);
  }
  restaurant.fssai_no = fssai_no;
  restaurant.fssai_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "fssai upload successfully" });
});
exports.createAndUploadGst = catchAsync(async (req, res, next) => {
  const { restaurantId, gst_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!gst_no) {
    return new AppError("No gst_no found", 404);
  }
  restaurant.gst_no = gst_no;
  restaurant.gst_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "gst upload successfully" });
});

exports.createAndUploadPan = catchAsync(async (req, res, next) => {
  const { restaurantId, pan_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!pan_no) {
    return new AppError("No pan_no found", 404);
  }
  restaurant.pan_no = pan_no;
  restaurant.pan_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "pan upload successfully" });
});

exports.createAndUploadAadhar = catchAsync(async (req, res, next) => {
  const { restaurantId, aadhar_no } = req.body;
  const file = req.file;
  const response = await uploadImg(file);
  const restaurant = await Restaurant.findById(restaurantId);
  if (!file) {
    return new AppError("No file found", 404);
  }
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  if (!aadhar_no) {
    return new AppError("No aadhar_no found", 404);
  }
  restaurant.aadhar_no = aadhar_no;
  restaurant.aadhar_image = response.Key;
  await restaurant.save();
  res
    .status(200)
    .json({ status: "success", message: "aadhar upload successfully" });
});
exports.uploadRestaurantLogo = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("image is missing", 404));
  }
  const restaurant = await Restaurant.findById(req.query.restaurantId);
  console.log(restaurant);
  if (!restaurant) {
    return new AppError("No restaurant found", 404);
  }
  const response = await uploadImg(file);

  restaurant.restaurant_logo = response.Key;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant logo uploaded successfully",
  });
});
exports.addTiming = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const checkTiming = await RestaurantTiming.findOne({
    restaurant: restaurant._id,
  });
  if (checkTiming) {
    if (sunday) {
      checkTiming.sunday = sunday;
    }
    if (monday) {
      checkTiming.monday = monday;
    }
    if (tuesday) {
      checkTiming.tuesday = tuesday;
    }
    if (wednesday) {
      checkTiming.wednesday = wednesday;
    }
    if (thursday) {
      checkTiming.thursday = thursday;
    }
    if (friday) {
      checkTiming.friday = friday;
    }
    if (saturday) {
      checkTiming.saturday = saturday;
    }
    await checkTiming.save();
  } else {
    const createTiming = await RestaurantTiming.create({
      restaurant: restaurant._id,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
    restaurant.timing = createTiming._id;
    await restaurant.save();
  }
  res
    .status(200)
    .json({ status: "success", message: "timing created successfully" });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.query.restaurantId)
    .populate("attributes")
    .populate("bankDetail")
    .populate("variations")
    .populate("addongroups")
    .populate("items")
    .populate("categories")
    .populate("taxes");
  res.status(200).json({
    restaurant,
    status: "success",
    message: " successfully",
  });
});
exports.getRestaurantItem = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.query.restaurantId)
    .populate("attributes")
    .populate("bankDetail")
    .populate("variations")
    .populate("addongroups")
    .populate("items")
    .populate("categories")
    .populate("taxes");
  res.status(200).json({
    restaurant,
    status: "success",
    message: " successfully",
  });
});
exports.addBankDetail = catchAsync(async (req, res, next) => {
  const { bankName, accountNumber, ifscCode, branch, accountHolderName } =
    req.body;
  const { restaurantId } = req.query;
  if (
    !(
      bankName &&
      accountNumber &&
      ifscCode &&
      restaurantId &&
      branch &&
      accountHolderName
    )
  ) {
    return next(
      new AppError(
        "bankName,accountNumber,ifscCode, restaurant is missing",
        404
      )
    );
  }
  const restaurant = await Restaurant.findById(restaurantId);

  const bankDetail = await BankDetail.create({
    bankName,
    accountNumber,
    ifscCode,
    branch,
    accountHolderName,
  });
  restaurant.bankDetail = bankDetail._id;
  await restaurant.save();
  res.status(200).json({
    bankDetail,
    status: "success",
    message: "Restaurant BankDetail created successfully",
  });
});

exports.updateContactDetails = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { owner_name, business_contact } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.owner_name = owner_name;
  restaurant.business_contact = business_contact;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant Contact Details",
  });
});

exports.updateTime = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { res_timings } = req.body;
  if (!(res_timings.length === 7)) {
    return next(new AppError("res_timings length is invalid", 404));
  }
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.res_timings = res_timings;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant timing updated successfully",
  });
});

exports.createTax = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { taxname, tax } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  const taxData = await Taxes.create({
    taxname,
    tax,
    active: "1",
    restaurant: restaurantId,
  });
  taxData.taxid = taxData._id.toString();
  restaurant.taxes.push(taxData._id);
  await restaurant.save();
  await taxData.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant tax created successfully",
  });
});

exports.getTaxes = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const taxData = await Taxes.find({
    restaurant: restaurantId,
  });

  res.status(200).json({
    data: taxData,
    status: "success",
    message: "Restaurant taxes",
  });
});

exports.createAttribute = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { array } = req.body;
  const attributes = [];
  const restaurant = await Restaurant.findById(restaurantId);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const data = await Attributes.create({
      attribute: element.attribute,
      active: "1",
      restaurant: restaurantId,
    });
    data.attributeid = data._id.toString();
    attributes.push(data._id);
    await data.save();
  }
  restaurant.attributes = attributes;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant tax created successfully",
  });
});

exports.getAttributes = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const taxData = await Attributes.find({
    restaurant: restaurantId,
  });

  res.status(200).json({
    data: taxData,
    status: "success",
    message: "Restaurant Attributes",
  });
});

exports.fix = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.find({
    approved: false,
    petPooja: false,
  });
  for (let index = 0; index < restaurant.length; index++) {
    const element = restaurant[index];
    const rest = await Restaurant.findById(element._id);
    for (let index = 0; index < element.taxes.length; index++) {
      const element2 = element.taxes[index];
      await Taxes.findByIdAndDelete(element2);
      rest.taxes.pull(element2);
      await rest.save();
    }

    const taxes = [
      { taxname: "SGST", tax: "2.5" },
      { taxname: "CGST", tax: "2.5" },
      { taxname: "SGST", tax: "9" },
      { taxname: "CGST", tax: "9" },
    ];
    for (let index = 0; index < taxes.length; index++) {
      const element3 = taxes[index];
      const tax = await Taxes.create({
        taxname: element3.taxname,
        tax: element3.tax,
        restaurant: rest._id,
        active: "1",
      });
      rest.taxes.push(tax._id);
      tax.taxid = tax._id.toString();
      await tax.save();
      await rest.save();
    }
  }
  // await restaurant.save();
  res.status(200).send("sdasdsdasd");
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  console.log(restaurant);
  if (restaurant.owner) {
    const owner = await Owner.findById(restaurant.owner);
    owner.restaurant.pull(restaurant._id);
    await owner.save();
    if (owner.restaurant.length === 0) {
      await Owner.findByIdAndDelete(restaurant.owner);
    }
  }
  if (restaurant.asm) {
    const asm = await ASM.findById(restaurant.asm);
    asm.restaurants.pull(restaurant._id);
    await asm.save();
  }
  for (let index = 0; index < restaurant.items.length; index++) {
    const itemElement = restaurant.items[index];
    await Items.findByIdAndUpdate(itemElement, { deleted: true });
  }
  restaurant.deleted = true;
  await restaurant.save();
  res.status(200).json({ status: "success", message: "Successfully deleted " });
});
//item visible
// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const { itemVisible } = req.body;
//   const { restaurantId } = req.query;

//   await Restaurant.findByIdAndUpdate(restaurantId, { itemVisible });

//   res.status(200).json({
//     status: "success",
//     message: "successfully",
//   });
// });
exports.visibleItem = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { itemVisible } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  restaurant.categories = itemVisible;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "restaurant app visible updated successfully",
  });
});
exports.editAttribute = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const { array } = req.body;
  const attributes = [];
  const restaurant = await Restaurant.findById(restaurantId);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const checkOld = await Attributes.findOne({
      attribute: element,
      restaurant: restaurantId,
    });
    if (!checkOld) {
      const data = await Attributes.create({
        attribute: element,
        active: "1",
        restaurant: restaurantId,
      });
      data.attributeid = data._id.toString();
      attributes.push(data._id);
      await data.save();
    } else {
      attributes.push(checkOld._id);
    }
  }
  restaurant.attributes = attributes;
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "Restaurant attributes updated successfully",
  });
});

exports.getThaneRestaurantUnapproved = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const cityRegex = new RegExp(`^${req.query.city.trim()}$`, "i");

  const restaurant = await Restaurant.find({
    approved: false,
    petPooja: false,
    city: cityRegex,
  })
    .populate("items")
    .populate("attributes")
    .populate("bankDetail")
    .populate("taxes")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count({
    approved: false,
    petPooja: false,
    city: cityRegex,
  });

  res.status(200).json({
    restaurant,
    total,
    status: "success",
    message: "successfully",
  });
});

// exports.getRestaurantApprovedFilter = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field, city } = req.query;
//   const skip = page * limit - limit;
//   const cityRegex = new RegExp(req.query.city.trim(), "i");

//   const restaurant = await Restaurant.find({
//     approved: true,
//     petPooja: false,
//     // city: "Thane",
//   })
//     .populate("items")
//     .populate("attributes")
//     .populate("bankDetail")
//     .populate("taxes")
//     .populate("status")

//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);
//   const total = await Restaurant.count({
//     approved: true,
//     petPooja: false,
//     city: { $regex: cityRegex },
//   });
//   res
//     .status(200)
//     .json({ restaurant, total, status: "success", message: "successfully" });
// });
// exports.getRestaurantApprovedFilter = catchAsync(async (req, res, next) => {
//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const cityRegex = new RegExp(`^${req.query.city.trim()}$`, "i");

//   const restaurant = await Restaurant.find({
//     approved: true,
//     petPooja: false,
//     city: cityRegex,
//   })
//     .populate("items")
//     .populate("attributes")
//     .populate("bankDetail")
//     .populate("taxes")
//     .populate("status")
//     .sort(
//       field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Restaurant.count({
//     approved: true,
//     petPooja: false,
//     city: cityRegex,
//   });

//   res
//     .status(200)
//     .json({ restaurant, total, status: "success", message: "successfully" });
// });
exports.getRestaurantApprovedFilter = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field, city } = req.query;
  const skip = page * limit - limit;

  let filter = {
    approved: true,
    petPooja: false,
  };

  if (city) {
    const cityRegex = new RegExp(`^${city.trim()}$`, "i");
    filter.city = cityRegex;
  }

  const restaurant = await Restaurant.find(filter)
    .populate("items")
    .populate("attributes")
    .populate("bankDetail")
    .populate("taxes")
    .populate("status")
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count(filter);

  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});

// exports.reportCalculation = catchAsync(async (req, res, next) => {
//   const orders = await Order.find({ status: "Delivered" })

//     .select(
//       "orderId  customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus pet"
//     )
//     .populate({
//       path: "orderItems",
//       select: "totalPrice itemTitle quantity",
//     })
//     .populate({ path: "coupon", select: "code couponType" })
//     .populate({ path: "restaurant", select: "bankDetail pan_no" })
//     .populate("deliveredAt");

//   for (const order of orders) {
//     const couponType = await Coupon.findById(order.coupon);
//     const existingReport = await BhiwandiOrderReport.findOne({
//       deliveredOrderId: order._id,
//     });
//     if (!existingReport) {
//       if (order.deliveryStatus === "Delivered") {
//         function financial(x) {
//           return Number.parseFloat(x).toFixed(2);
//         }

//         let bankId = order.restaurant.bankDetail;
//         let petpooja = order.restaurant.petPooja;
//         let actualAmountCollectedOnMenu = 0;
//         let commision = 0;
//         let payableAmount = 0;
//         actualAmountCollectedOnMenu = order.totalPrice;
//         console.log(
//           `actualAmountCollectedOnMenu:${actualAmountCollectedOnMenu}`
//         );
//         // commision = (actualAmountCollectedOnMenu * 10) / 100;
//         // console.log(`commision:${commision}`);

//         //try

//         const createdReports = await BhiwandiOrderReport.create({
//           deliveredOrderId: order._id,
//           couponType: couponType ? couponType._id : null,
//           actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
//           restaurantId: order.restaurant,
//           // deliveryPartnerId: order.deliveryPartner,
//           // customerId: order.customer,
//           // bankDetails: bankId,
//           // petPooja: petpooja,
//           // YbitesCommission: financial(YbitesCommission),
//         });
//       }
//     }
//   }

//   const total = await Order.count({ status: "Delivered" });
//   res.status(200).json({ data: orders, total });
// });
// exports.reportCalculation = catchAsync(async (req, res, next) => {
//     try {
//     const orders = await Order.find({ status: "Delivered" })
//       .select(
//         "orderId customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus pet"
//       )
//       // .populate({
//       //   path: "orderItems",
//       //   select: "item totalPrice itemTitle quantity ",
//       // })
//       .populate({
//         path: 'orderItems',
//         select: 'item itemTitle totalPrice quantity',
//         populate: {
//           path: 'item',
//           select: 'bhiwandiItemPrice',
//         },
//       })



//       .populate({ path: "coupon", select: "code couponType" })
//       .populate({ path: "restaurant", select: "bankDetail pan_no petPooja " })
//       .populate("deliveredAt");

//     for (const order of orders) {
//       const couponType = await Coupon.findById(order.coupon);
//       const existingReport = await BhiwandiOrderReport.findOne({
//         deliveredOrderId: order._id,
//       });

//       if (!existingReport && order.deliveryStatus === "Delivered") {
//         function financial(x) {
//           return Number.parseFloat(x).toFixed(2);
//         }

//         let actualAmountCollectedOnMenu = order.totalPrice;
//         // console.log(
//         //   actualAmountCollectedOnMenu:${actualAmountCollectedOnMenu}
//         // );
//         let commision = (actualAmountCollectedOnMenu * 10) / 100;
//         // console.log(commision:${commision});
//         let payableAmount = actualAmountCollectedOnMenu - commision;
//         // console.log(payableAmount:${payableAmount});

//         const createdReport = await BhiwandiOrderReport.create({
//           deliveredOrderId: order._id,
//           couponType: couponType ? couponType._id : null,
//           actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
//           payableAmount: payableAmount,
//           restaurantId: order.restaurant,
//           deliveryPartnerId: order.deliveryPartner,
//           customerId: order.customer,
//           bankDetails: order.restaurant.bankDetail,
//           petPooja: order.restaurant.petPooja,
//           commision: financial(commision),
//         });
//       }
//     }
//     const report = await BhiwandiOrderReport.find({}).populate({
//       path: "deliveredOrderId",
//       model: "Order",
//       populate: [
//         // { path: "orderId orderItems", select: "itemTitle price quantity bhiwandiItemPrice" },
//         {
//           path: "orderId orderItems",
//           select: "itemTitle price quantity bhiwandiItemPrice",
//           populate: {
//             path: 'item',
//             select: 'bhiwandiItemPrice',
//           },
//         },


//         { path: "coupon", select: "code couponType" },
//         {
//           path: "restaurant",
//           select: " petPooja couponType brand_display_name city",
//         },

//       ],
//       select:
//         "paymentAmount discount totalPrice grandTotalPrice paymentMode  status  deliveredAt",
//     });

  


//     const filteredReport = report.filter((item) => {
//       if (item.deliveredOrderId && item.deliveredOrderId.restaurant) {
//         return item.deliveredOrderId.restaurant.city === "Bhiwandi";
//       }
//       return false;
//     });
//     res.status(200).json({
//       status: "success",
//       message: "Bhiwandi Report",
//       data: filteredReport,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// exports.reportCalculation = catchAsync(async (req, res, next) => {
//   try {
//     const orders = await Order.find({ status: "Delivered" })
//       .select(
//         "orderId customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus pet"
//       )
//       .populate({
//         path: 'orderItems',
//         select: 'item itemTitle totalPrice quantity',
//         populate: {
//           path: 'item',
//           select: 'bhiwandiItemPrice',
//         },
//       })
//       .populate({ path: "coupon", select: "code couponType" })
//       .populate({ path: "restaurant", select: "bankDetail pan_no petPooja " })
//       .populate("deliveredAt");

//     for (const order of orders) {
//       let payableAmount = 0;
//   let actualAmountCollectedOnMenu=0;
//    let commision=0;
//       for (const orderItem of order.orderItems) {
//         const bhiwandiItemPrice = orderItem.item && orderItem.item.bhiwandiItemPrice
//           ? orderItem.item.bhiwandiItemPrice
//           : 0;
//         const quantity = orderItem.quantity || 1; 

//         const actualAmountCollectedOnMenu = bhiwandiItemPrice * quantity;

//         console.log(`actualAmountCollectedOnMenu: ${actualAmountCollectedOnMenu}`);

//         const commision = (actualAmountCollectedOnMenu * 10) / 100;
//         console.log(`commision: ${commision}`);

//         payableAmount = actualAmountCollectedOnMenu - commision;
//         console.log(`payableAmount: ${payableAmount}`);

//       }

//       const couponType = await Coupon.findById(order.coupon);

//       const createdReport = await BhiwandiOrderReport.create({
//         deliveredOrderId: order._id,
//         couponType: couponType ? couponType._id : null,
//         actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
//         payableAmount: payableAmount,
//         restaurantId: order.restaurant,
//         deliveryPartnerId: order.deliveryPartner,
//         customerId: order.customer,
//         bankDetails: order.restaurant.bankDetail,
//         petPooja: order.restaurant.petPooja,
//         commision: commision,

//       });
//     }

//     // ... rest of your code
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// exports.reportCalculation = catchAsync(async (req, res, next) => {
//   try {
//     const orders = await Order.find({ status: "Delivered" })
//       .select(
//         "orderId customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus pet"
//       )
//       .populate({
//         path: 'orderItems',
//         select: 'item itemTitle totalPrice quantity',
//         populate: {
//           path: 'item',
//           select: 'bhiwandiItemPrice',
//         },
//       })
//       .populate({ path: "coupon", select: "code couponType" })
//       .populate({ path: "restaurant", select: "bankDetail pan_no petPooja " })
//       .populate("deliveredAt");

//     for (const order of orders) {
//       let restaurantPayableAmount = 0;
//       let actualAmountCollectedOnMenu = 0;
//       let bhiwandiCommision = 0;

//       for (const orderItem of order.orderItems) {
//         const bhiwandiItemPrice = orderItem.item && orderItem.item.bhiwandiItemPrice
//           ? orderItem.item.bhiwandiItemPrice
//           : 0;
//         const quantity = orderItem.quantity || 1; 

//         actualAmountCollectedOnMenu = (bhiwandiItemPrice * quantity).toFixed(2);

//         console.log(`actualAmountCollectedOnMenu: ${actualAmountCollectedOnMenu}`);

//         bhiwandiCommision = (actualAmountCollectedOnMenu * 10) / 100;
//         console.log(`commision: ${bhiwandiCommision}`);

//         restaurantPayableAmount = (actualAmountCollectedOnMenu - bhiwandiCommision).toFixed(2);
//         console.log(`restaurantPayableAmount: ${restaurantPayableAmount}`);
//       }

//       const couponType = await Coupon.findById(order.coupon);

//       const createdReport = await BhiwandiOrderReport.create({
//         deliveredOrderId: order._id,
//         couponType: couponType ? couponType._id : null,
//         actualAmountCollectedOnMenu: actualAmountCollectedOnMenu,
//         restaurantPayableAmount: restaurantPayableAmount,
//         restaurantId: order.restaurant,
//         deliveryPartnerId: order.deliveryPartner,
//         customerId: order.customer,
//         bankDetails: order.restaurant.bankDetail,
//         petPooja: order.restaurant.petPooja,
//         bhiwandiCommision: bhiwandiCommision,
//       });
//     }

//     // ... rest of your code

//     // Respond with the created report
//     const report = await BhiwandiOrderReport.find({})
//     .sort({ createdAt: -1 })
//     .populate({
//       path: "deliveredOrderId",
//       model: "Order",
//       populate: [
//         {
//           path: "orderId orderItems",
//           select: "itemTitle price quantity bhiwandiItemPrice",
//           populate: {
//             path: 'item',
//             select: 'bhiwandiItemPrice',
//           },
//         },
//         { path: "coupon", select: "code couponType" },
//         {
//           path: "restaurant",
//           select: "petPooja couponType brand_display_name city",
//         },
//       ],
//       select: "paymentAmount discount totalPrice grandTotalPrice paymentMode status deliveredAt",
//     });

//     const filteredReport = report.filter((item) => {
//       if (item.deliveredOrderId && item.deliveredOrderId.restaurant) {
//         return item.deliveredOrderId.restaurant.city === "Bhiwandi";
//       }
//       return false;
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Bhiwandi Report",
//       data: filteredReport,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// exports.reportCalculation = catchAsync(async (req, res, next) => {
//   try {
//     const orders = await Order.find({ status: "Delivered" })
//       .select(
//         "orderId customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus petpooja"
//       )
//       .populate({
//         path: 'orderItems',
//         select: 'item itemTitle totalPrice quantity ',
//         populate: {
//           path: 'item',
//           select: 'bhiwandiItemPrice ',
//         },
//       })
//       .populate({ path: "coupon", select: "code couponType" })
//       .populate({ path: "restaurant", select: "bankDetail pan_no petPooja " })
//       .populate("deliveredAt");

//     for (const order of orders) {
//       let totalAmountPayable = 0;
//       let totalAmountAsperFetch = 0;
//       let totalAmountPerOrder=0;
//       let amountAddedPerOrder=0;
// let menuPrice=0;
// let gSTOnMenuCart=0;
// let totalGst=0;
// let ybitesCollection=0;
// let deduction=0;
// let profit=0;
// let ybitesCommission=0;
// let totalCommission=0;
// let restaurantAfterDiscountPrice =0;
// // try
  



//       for (const orderItem of order.orderItems) {
//         const bhiwandiItemPrice = orderItem.item && orderItem.item.bhiwandiItemPrice
//           ? orderItem.item.bhiwandiItemPrice
//           : 0;
//         const quantity = orderItem.quantity || 1;

//         const itemTotal = orderItem.totalPrice || (orderItem.price * quantity);
//         totalAmountAsperFetch += (bhiwandiItemPrice * quantity);
   
       
//         totalAmountPayable = (totalAmountAsperFetch * 0.9).toFixed(2);
//         ybitesCommission = (totalAmountAsperFetch - totalAmountPayable).toFixed(2);
//         // (totalPrice)
//         totalAmountPerOrder=order.totalPrice;
//         menuPrice=order.totalPrice;
//         amountAddedPerOrder= menuPrice - totalAmountAsperFetch 
//         gSTOnMenuCart=(totalAmountPerOrder*5/100).toFixed(2);
//         ybitesCommission=(totalAmountAsperFetch * 10/100).toFixed(2);
//         totalGst=gSTOnMenuCart ;
        
       
//         ybitesCollection = parseFloat(totalAmountPerOrder) + parseFloat(gSTOnMenuCart) + parseFloat(order.deliveryCharge) + parseFloat(order.packagingCharge);

//           deduction = parseFloat(totalAmountPayable) + parseFloat(order.deliveryBoyShare) + parseFloat(gSTOnMenuCart);
//        profit =parseFloat(ybitesCollection) - parseFloat(deduction);
//        totalCommission=parseFloat(amountAddedPerOrder) + parseFloat(ybitesCommission);
//         const couponType = await Coupon.findById(order.coupon);

//     if (couponType !== null) {
//       if (couponType.couponType === "restaurant") {
//         restaurantAfterDiscountPrice =totalAmountAsperFetch - order.discount;
//         gSTOnMenuCart = Number(restaurantAfterDiscountPrice * 5) / 100;
//         ybitesCommission = (restaurantAfterDiscountPrice * 10) / 100;

//         totalAmountPayable =
//           Number(restaurantAfterDiscountPrice) -
//           Number(ybitesCommission) 
        
//       } 
//     } 
//     }
   

//     const couponType = await Coupon.findById(order.coupon);

    

//       const createdReport = await BhiwandiOrderReport.create({
//         deliveredOrderId: order._id,
//         couponType: couponType ? couponType._id : null,
//         menuPrice:order.totalPrice,
//         totalAmountAsperFetch: totalAmountAsperFetch,
//         totalAmountPayable: totalAmountPayable,
//         restaurantId: order.restaurant,
//         deliveryPartnerId: order.deliveryPartner,
//         customerId: order.customer,
//         bankDetails: order.restaurant.bankDetail,
//         petPooja: order.restaurant.petPooja,
//         totalAmountPerOrder: totalAmountPerOrder,
//         amountAddedPerOrder:amountAddedPerOrder,
//         gSTOnMenuCart:gSTOnMenuCart,
//         ybitesCommision:ybitesCommission,
//         totalGst:totalGst,
//         ybitesCollection:ybitesCollection,
//         deduction:deduction,
//         profit:profit,
//         totalCommission:totalCommission,
//         restaurantAfterDiscountPrice:restaurantAfterDiscountPrice,
//       });
//     }

 
//     const report = await BhiwandiOrderReport.find({})
//       .sort({ createdAt: -1 }) 
//       .populate({
//         path: "deliveredOrderId",
//         model: "Order",
//         populate: [
//           {
//             path: "orderId orderItems",
//             select: "itemTitle price  totalPrice quantity bhiwandiItemPrice",
//             populate: {
//               path: 'item',
//               select: ' itemname price  bhiwandiItemPrice',
//             },
//           },
//           { path: "coupon", select: "code couponType" },
//           {
//             path: "restaurant",
//             select: "petPooja couponType brand_display_name city",
//           },
//         ],
//         select: "paymentAmount discount totalPrice grandTotalPrice paymentMode status deliveredAt deliveryCharge packagingCharge deliveryBoyShare",
//       });

//     const filteredReport = report.filter((item) => {
//       if (item.deliveredOrderId && item.deliveredOrderId.restaurant) {
//         return item.deliveredOrderId.restaurant.city === "Bhiwandi";
//       }
//       return false;
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Bhiwandi Report",
//       data: filteredReport,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
exports.reportCalculation = catchAsync(async(req,res,next)=>{
  try {
    const orders = await Order.find({ status: "Delivered" })
      .select("orderId customer orderItems grandTotalPrice couponDiscountPrice totalPrice totalTaxes discount deliveryStatus deliveryCharge deliveryTip packagingCharge discount paymentAmount deliveryBoyShare createdAt paymentStatus petpooja")
      .populate({
        path: 'orderItems',
        select: 'item itemTitle totalPrice quantity ',
        populate: {
          path: 'item',
          select: 'bhiwandiItemPrice ',
        },
      })
      .populate({ path: "coupon", select: "code couponType" })
      .populate({ path: "restaurant", select: "bankDetail pan_no petPooja " })
      .populate("deliveredAt")
      .lean();

    const reportCreationPromises = orders.map(async (order) => {
      let totalAmountPayable = 0;
      let totalAmountAsperFetch = 0;
      let totalAmountPerOrder = 0;
      let amountAddedPerOrder = 0;
      let menuPrice = 0;
      let gSTOnMenuCart = 0;
      let totalGst = 0;
      let ybitesCollection = 0;
      let deduction = 0;
      let profit = 0;
      let ybitesCommission = 0;
      let totalCommission = 0;
      let restaurantAfterDiscountPrice = 0;

      for (const orderItem of order.orderItems) {
        const bhiwandiItemPrice = orderItem.item && orderItem.item.bhiwandiItemPrice
          ? orderItem.item.bhiwandiItemPrice
          : 0;
        const quantity = orderItem.quantity || 1;

        const itemTotal = orderItem.totalPrice || (orderItem.price * quantity);
        totalAmountAsperFetch += bhiwandiItemPrice * quantity;

        totalAmountPayable = (totalAmountAsperFetch * 0.9).toFixed(2);
        ybitesCommission = (totalAmountAsperFetch - totalAmountPayable).toFixed(2);
        totalAmountPerOrder = order.totalPrice;
        menuPrice = order.totalPrice;
        amountAddedPerOrder = menuPrice - totalAmountAsperFetch;
        gSTOnMenuCart = (totalAmountPerOrder * 5 / 100).toFixed(2);
        ybitesCommission = (totalAmountAsperFetch * 10 / 100).toFixed(2);
        totalGst = gSTOnMenuCart;

        ybitesCollection = parseFloat(totalAmountPerOrder) + parseFloat(gSTOnMenuCart) + parseFloat(order.deliveryCharge) + parseFloat(order.packagingCharge);

        deduction = parseFloat(totalAmountPayable) + parseFloat(order.deliveryBoyShare) + parseFloat(gSTOnMenuCart);
        profit = parseFloat(ybitesCollection) - parseFloat(deduction);
        totalCommission = parseFloat(amountAddedPerOrder) + parseFloat(ybitesCommission);

        const couponType = await Coupon.findById(order.coupon);

        if (couponType !== null) {
          if (couponType.couponType === "restaurant") {
            restaurantAfterDiscountPrice = totalAmountAsperFetch - order.discount;
            gSTOnMenuCart = Number(restaurantAfterDiscountPrice * 5) / 100;
            ybitesCommission = (restaurantAfterDiscountPrice * 10) / 100;

            totalAmountPayable =
              Number(restaurantAfterDiscountPrice) -
              Number(ybitesCommission);
          }
        }
      }

      const couponType = await Coupon.findById(order.coupon);

      const createdReportData = {
        deliveredOrderId: order._id,
        couponType: couponType ? couponType._id : null,
        menuPrice: order.totalPrice,
        totalAmountAsperFetch: totalAmountAsperFetch,
        totalAmountPayable: totalAmountPayable,
        restaurantId: order.restaurant,
        deliveryPartnerId: order.deliveryPartner,
        customerId: order.customer,
        bankDetails: order.restaurant.bankDetail,
        petPooja: order.restaurant.petPooja,
        totalAmountPerOrder: totalAmountPerOrder,
        amountAddedPerOrder: amountAddedPerOrder,
        gSTOnMenuCart: gSTOnMenuCart,
        ybitesCommision: ybitesCommission,
        totalGst: totalGst,
        ybitesCollection: ybitesCollection,
        deduction: deduction,
        profit: profit,
        totalCommission: totalCommission,
        restaurantAfterDiscountPrice: restaurantAfterDiscountPrice,
      };

      return createdReportData;
    });

    const createdReports = await Promise.all(reportCreationPromises);

    await BhiwandiOrderReport.create(createdReports);

    const report = await BhiwandiOrderReport.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "deliveredOrderId",
        model: "Order",
        populate: [
          {
            path: "orderId orderItems",
            select: "itemTitle price  totalPrice quantity bhiwandiItemPrice",
            populate: {
              path: 'item',
              select: ' itemname price  bhiwandiItemPrice',
            },
          },
          { path: "coupon", select: "code couponType" },
          {
            path: "restaurant",
            select: "petPooja couponType brand_display_name city",
          },
        ],
        select: "paymentAmount discount totalPrice grandTotalPrice paymentMode status deliveredAt deliveryCharge packagingCharge deliveryBoyShare",
      });

    const filteredReport = report.filter((item) => item.deliveredOrderId?.restaurant?.city === "Bhiwandi");

    res.status(200).json({
      status: "success",
      message: "Bhiwandi Report",
      data: filteredReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.getBhiwandiRestaurant=catchAsync(async(req,res,next)=>{
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  const query = {
    approved: true,
    petPooja: false,
    city:"Bhiwandi"
    
  };

  const restaurant = await Restaurant.find(query)
    .populate("items")
    // .populate("attributes")
    // .populate("bankDetail")
    // .populate("taxes")
    .populate("status")
    // .populate({ path: "asm", select: "name" })
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Restaurant.count(query);

  res
    .status(200)
    .json({ restaurant, total, status: "success", message: "successfully" });
});


exports.getBhiwandiRestaurantItemPrice = catchAsync(async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { bhiwandiItemPrice } = req.body;
const item = await Items.findById(itemId);
item.bhiwandiItemPrice = bhiwandiItemPrice;
await item.save();

    res.status(200).json({ message: 'Bhiwandi item price updated successfully', item });
  } catch (error) {
    next(error);
  }
});

exports.getRestaurantItemPrice=catchAsync(async(req,res,next)=>{
  const resId=req.params.resId;
  const order = await Order.findOne({ restaurant: resId }).populate("orderItems")
  const items = await Items.find({ restaurant: resId }).populate('restaurant');
  res.status(200).json({message: 'Bhiwandi item price updated successfully',items,order})
})