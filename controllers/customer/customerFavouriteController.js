// Import required modules and models
const FavouriteRestaurant = require("./../../models/favourite/favouriteRestaurantModel");
const FavouriteMenuItem = require("./../../models/favourite/favouriteMenuItemModel");
const catchAsync = require("../../utils/catchAsync");
const Attributes = require("../../models/item/attributesModel");
const Items = require("../../models/item/itemsModel");
const Restaurant = require("../../models/restaurant/restaurantModel");

// Add a menu item to the customer's favorites
exports.addMenuItemToFavourite = catchAsync(async (req, res, next) => {
  const { itemId } = req.query;
  const item = await Items.findById(itemId);

  // Check if the customer already has a favorite menu item record
  const favouriteMenuItemCheck = await FavouriteMenuItem.findOne({
    customer: req.customer,
  });

  if (favouriteMenuItemCheck) {
    if (!favouriteMenuItemCheck.items.includes(item._id)) {
      favouriteMenuItemCheck.items.push(itemId);
    }
    await favouriteMenuItemCheck.save();
  } else {
    await FavouriteMenuItem.create({
      customer: req.customer,
      items: [itemId],
    });
  }

  // Respond with success message
  res
    .status(200)
    .json({ success: "success", message: "Successfully added to favorites" });
});

// Remove a menu item from the customer's favorites
exports.removeMenuItemToFavourite = catchAsync(async (req, res, next) => {
  const { itemId } = req.query;
  const favouriteMenuItemCheck = await FavouriteMenuItem.findOne({
    customer: req.customer,
  });

  favouriteMenuItemCheck.items.pull(itemId);
  await favouriteMenuItemCheck.save();

  // Respond with success message
  res
    .status(200)
    .json({
      success: "success",
      message: "Successfully removed from favorites",
    });
});

// Get favorite menu items for a customer
exports.getFavouriteMenuItem = catchAsync(async (req, res, next) => {
  const items = await FavouriteMenuItem.findOne({
    customer: req.customer._id,
  }).populate({ path: "items" });

  const data = [];

  if (items) {
    for (let index = 0; index < items.items.length; index++) {
      const item = items.items[index].toObject({ getters: true });
      item.item_attribute = await Attributes.findOne({
        attributeid: item.item_attributeid,
      });
      data.push(item);
    }
  }

  // Respond with favorite menu items
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved favorite menu items",
    data: data,
  });
});

// Add a restaurant to the customer's favorites
exports.addRestaurantToFavourite = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const favouriteRestaurantCheck = await FavouriteRestaurant.findOne({
    customer: req.customer,
  });
  const restaurant = await Restaurant.findById(restaurantId);

  if (favouriteRestaurantCheck) {
    if (!favouriteRestaurantCheck.restaurants.includes(restaurant._id)) {
      favouriteRestaurantCheck.restaurants.push(restaurantId);
    }
    await favouriteRestaurantCheck.save();
  } else {
    await FavouriteRestaurant.create({
      customer: req.customer,
      restaurants: [restaurantId],
    });
  }

  // Respond with success message
  res
    .status(200)
    .json({ success: "success", message: "Successfully added to favorites" });
});

// Remove a restaurant from the customer's favorites
exports.removeRestaurantToFavourite = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const favouriteRestaurantCheck = await FavouriteRestaurant.findOne({
    customer: req.customer,
  });

  favouriteRestaurantCheck.restaurants.pull(restaurantId);
  await favouriteRestaurantCheck.save();

  // Respond with success message
  res
    .status(200)
    .json({
      success: "success",
      message: "Successfully removed from favorites",
    });
});

// Get favorite restaurants for a customer
exports.getFavouriteRestaurant = catchAsync(async (req, res, next) => {
  const data = await FavouriteRestaurant.findOne({
    customer: req.customer._id,
  }).populate({
    path: "restaurants",
    populate: [
      { path: "ordertypes", select: "ordertype ordertypeid" },
      { path: "attributes", select: "attribute" },
    ],
  });

  // Respond with favorite restaurants
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved favorite restaurants",
    data: data ? data.restaurants : [],
  });
});
