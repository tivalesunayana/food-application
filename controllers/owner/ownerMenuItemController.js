const Items = require("../../models/item/itemsModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
// const Customization = require("../../models/menuItem/customizationModel");
// const CustomizationItem = require("../../models/menuItem/customizationItemModel");
const Addongroups = require("../../models/item/addongroupsModel");
// const AddOnItem = require("../../models/menuItem/addOnItemModel");
// const Option = require("../../models/menuItem/optionModel");
// const OptionItem = require("../../models/menuItem/optionItemModel");
const { uploadImg, deleteFile } = require("../../config/s3config");
const Restaurant = require("../../models/restaurant/restaurantModel");
// const MenuItemTiming = require("../../models/menuItem/menuItemTimingModel");
// const MenuSubCategory = require("../../models/menuItem/menuItemSubCategoryModel");
const Categories = require("../../models/categories/categoriesModel");

exports.createCustomization = catchAsync(async (req, res, next) => {
  const { title, maximumSelect, menuItemId } = req.body;
  const customization = await Customization.create({
    title,
    maximumSelect: maximumSelect * 1,
    menuItem: menuItemId,
  });
  const menuItem = await MenuItem.findById(menuItemId);
  menuItem.customizations.push(customization._id);
  await menuItem.save();
  res.status(200).json({
    customization,
    status: "success",
    message: "Customization Created successfully",
  });
});

exports.getCustomization = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const customization = await Customization.find({
    menuItem: menuItemId,
  }).populate("customizationItems");
  res.status(200).json({
    customization,
    status: "success",
    message: "successfully",
  });
});

exports.uploadImageCustomization = catchAsync(async (req, res, next) => {
  const { customizationId } = req.query;
  const file = req.files;
  const customization = await Customization.findById(customizationId);
  const response = uploadImg(file);
  if (customization.image) {
    await deleteFile(customization.image);
  }
  customization.image = (await response).Key;
  await customization.save();
  res.status(200).json({
    customization,
    status: "success",
    message: "Customization image uploaded  successfully",
  });
});

exports.addItemCustomization = catchAsync(async (req, res, next) => {
  const { customizationId } = req.query;
  const { title, price } = req.body;
  const customization = await Customization.findById(customizationId);
  const customizationItem = await CustomizationItem.create({
    title,
    price,
  });
  customization.customizationItems.push(customizationItem._id);
  await customization.save();
  res.status(200).json({
    customization,
    status: "success",
    message: "Customization Item Created successfully",
  });
});

// addOn

exports.createAddOn = catchAsync(async (req, res, next) => {
  const { title, restaurantId } = req.body;
  const addOn = await AddOn.create({
    title,
    restaurant: restaurantId,
  });
  res.status(200).json({
    addOn,
    status: "success",
    message: "AddOn Created successfully",
  });
});

exports.getAddOn = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const addOn = await AddOn.find({
    restaurant: restaurantId,
  }).populate("addOnItems");
  res.status(200).json({
    addOn,
    status: "success",
    message: "successfully",
  });
});

exports.addItemAddOn = catchAsync(async (req, res, next) => {
  const { addOnId } = req.query;

  const { title, price } = req.body;
  const addOn = await AddOn.findById(addOnId);
  const addOnItem = await AddOnItem.create({
    title,
    price,
  });
  addOn.addOnItems.push(addOnItem._id);
  await addOn.save();
  res.status(200).json({
    addOnItem,
    status: "success",
    message: "AddOn Item Created successfully",
  });
});

// option

exports.createOption = catchAsync(async (req, res, next) => {
  const { title, menuItemId, maximumSelect } = req.body;
  const option = await Option.create({
    title,
    menuItem: menuItemId,
    maximumSelect: maximumSelect * 1,
  });
  const menuItem = await MenuItem.findById(menuItemId);
  menuItem.options.push(option._id);
  await menuItem.save();
  res.status(200).json({
    option,
    status: "success",
    message: "Option Created successfully",
  });
});

exports.getOption = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const option = await Option.find({
    menuItem: menuItemId,
  }).populate("optionItems");
  res.status(200).json({
    option,
    status: "success",
    message: "successfully",
  });
});

exports.addItemOption = catchAsync(async (req, res, next) => {
  const { optionId } = req.query;
  const { title, price } = req.body;
  const option = await Option.findById(optionId);
  const optionItem = await OptionItem.create({
    title,
    price,
  });
  option.optionItems.push(optionItem._id);
  await option.save();
  res.status(200).json({
    optionItem,
    status: "success",
    message: "option Item Created successfully",
  });
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { menuCategoryId } = req.query;
  const menuCategory = await MenuCategory.findById(menuCategoryId);
  if (!menuCategory) {
    return next(new AppError("menuCategoryId id is invalid, ", 403));
  }
  const menuSubCategory = await MenuSubCategory.create({
    title,
    menuCategory: menuCategory._id,
  });
  menuCategory.menuSubCategories.push(menuSubCategory._id);
  await menuCategory.save();
  res.status(200).json({
    menuSubCategory,
    status: "success",
    message: "MenuSubCategory Created successfully",
  });
});

exports.editSubCategory = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { subCategoryId } = req.query;
  const subCategory = await MenuSubCategory.findById(subCategoryId);
  if (!subCategory) {
    return next(new AppError("SubCategory  id is invalid, ", 403));
  }
  subCategory.title = title;

  await subCategory.save();
  res.status(200).json({
    status: "success",
    message: "MenuSubCategory updated successfully",
  });
});

exports.getSubCategory = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("restaurant id is invalid, ", 403));
  }
  const menuSubCategory = await MenuSubCategory.find({
    restaurant: restaurantId,
  });
  res.status(200).json({
    menuSubCategory,
    status: "success",
    message: "successfully",
  });
});

exports.createMenuCategory = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("restaurant id is invalid, ", 403));
  }
  const menuCategory = await MenuCategory.create({
    title,
    restaurant: restaurantId,
  });
  restaurant.menuCategories.push(menuCategory._id);
  await restaurant.save();
  res.status(200).json({
    menuCategory,
    status: "success",
    message: "MenuCategory Created successfully",
  });
});

exports.editMenuCategory = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { menuCategoryId } = req.query;
  const menuCategory = await MenuCategory.findById(menuCategoryId);
  if (!menuCategory) {
    return next(new AppError("restaurant id is invalid, ", 403));
  }
  menuCategory.title = title;

  await menuCategory.save();
  res.status(200).json({
    status: "success",
    message: "MenuCategory updated successfully",
  });
});

exports.getMenuCategory = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError("restaurant id is invalid, ", 403));
  }
  const menuCategory = await MenuCategory.find({
    restaurant: restaurantId,
  }).populate("menuSubCategories");
  res.status(200).json({
    menuCategory,
    status: "success",
    message: "successfully",
  });
});

exports.editAddOn = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { addOnId } = req.query;
  const addOn = await AddOn.findById(addOnId);
  if (!addOn) {
    return next(new AppError("addOn  id is invalid, ", 403));
  }
  addOn.title = title;

  await addOn.save();
  res.status(200).json({
    status: "success",
    message: "addOn updated successfully",
  });
});
exports.editAddOnItem = catchAsync(async (req, res, next) => {
  const { title, price } = req.body;
  const { addOnItemId } = req.query;
  const addOnItem = await AddOnItem.findById(addOnItemId);
  if (!addOnItem) {
    return next(new AppError("addOnItem  id is invalid, ", 403));
  }

  addOnItem.title = title;
  addOnItem.price = price;

  await addOnItem.save();
  res.status(200).json({
    status: "success",
    message: "addOnItem updated successfully",
  });
});

// MenuItem
exports.editMenuItem = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const {
    title,
    description,
    menuItemType,
    discount,
    price,
    unitPrice,
    preparationTime,
    cuisine,
    category,
    menuSubCategory,
    menuCategory,
    customizations,
    addOns,
    options,
  } = req.body;
  console.log(req.body);
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem.menuCategory.equals(menuCategory)) {
    const oldMenuCategory = await MenuCategory.findById(menuItem.menuCategory);
    oldMenuCategory.menuItems.pull(menuItem);
    await oldMenuCategory.save();
    if (!menuSubCategory) {
      const newMenuCategory = await MenuCategory.findById(menuCategory);
      newMenuCategory.menuItems.push(menuItem);
      await newMenuCategory.save();
      if (menuItem.menuSubCategory) {
        const oldMenuSubCategory = await MenuSubCategory.findById(
          menuItem.menuSubCategory
        );
        oldMenuSubCategory.menuItems.pull(menuItem);
        await oldMenuSubCategory.save();
      }
    }
  }
  if (menuSubCategory) {
    if (!menuItem.menuSubCategory.equals(menuSubCategory)) {
      const oldMenuSubCategory = await MenuSubCategory.findById(
        menuItem.menuSubCategory
      );
      oldMenuSubCategory.menuItems.pull(menuItem);
      await oldMenuSubCategory.save();
      const newMenuSubCategory = await MenuSubCategory.findById(
        menuSubCategory
      );
      newMenuSubCategory.menuItems.push(menuItem);
      await newMenuSubCategory.save();
    }
  }
  if (title) {
    menuItem.title = title;
  }
  if (description) {
    menuItem.description = description;
  }
  if (menuItemType) {
    menuItem.menuItemType = menuItemType;
  }
  if (discount) {
    menuItem.discount = discount;
  }
  if (price) {
    menuItem.price = price;
  }
  if (unitPrice) {
    menuItem.unitPrice = unitPrice;
  }
  if (preparationTime) {
    menuItem.preparationTime = preparationTime;
  }
  if (cuisine) {
    menuItem.cuisine = cuisine;
  }
  if (category) {
    menuItem.category = category;
  }
  if (menuSubCategory) {
    menuItem.menuSubCategory = menuSubCategory;
  }
  if (menuCategory) {
    menuItem.menuCategory = menuCategory;
  }
  if (customizations) {
    menuItem.customizations = customizations;
  }
  if (addOns) {
    menuItem.addOns = addOns;
  }
  if (options) {
    menuItem.options = options;
  }
  await menuItem.save();
  res.status(200).json({
    status: "success",
    message: "MenuItem saved successfully",
    data: menuItem,
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  const {
    title,
    menuItemType,
    discount,
    description,
    price,
    customization,
    options,
    cuisine,
    unitPrice,
    // packingCharge,
    preparationTime,
    category,
    menuCategory,
    menuSubCategory,
    // customizationIds,
    addOnIds,
  } = req.body;
  console.log(restaurantId);
  if (!(title && menuItemType && price && restaurantId && menuCategory)) {
    return next(
      new AppError(
        "title, menuItemType, price, restaurantId, menuCategory",
        403
      )
    );
  }

  const menuItem = await MenuItem.create({
    title,
    menuItemType,
    description,
    discount,
    price,
    unitPrice: unitPrice * 1,
    // packingCharge: packingCharge * 1,
    preparationTime: preparationTime * 1,
    restaurant: restaurantId,
    cuisine,
    menuSubCategory,
    menuCategory,
    category,
    addOns: addOnIds,
  });

  for (let index = 0; index < customization.length; index++) {
    const element = customization[index];
    const customizationData = await Customization.create({
      title: element.title,
      maximumSelect: element.maximumSelect * 1,
      menuItem: menuItem._id,
    });
    menuItem.customizations.push(customizationData._id);
    for (let index = 0; index < element.customizationItems.length; index++) {
      const element2 = element.customizationItems[index];
      const customizationItemData = await CustomizationItem.create({
        title: element2.title,
        price: element2.price * 1,
      });
      customizationData.customizationItems.push(customizationItemData._id);
    }
    await customizationData.save();
  }

  for (let index = 0; index < options.length; index++) {
    const element = options[index];
    const optionsData = await Option.create({
      title: element.title,
      maximumSelect: element.maximumSelect * 1,
      menuItem: menuItem._id,
    });
    menuItem.options.push(optionsData._id);
    for (let index = 0; index < element.optionsItems.length; index++) {
      const element2 = element.optionsItems[index];
      const optionItemData = await OptionItem.create({
        title: element2.title,
      });
      optionsData.optionItems.push(optionItemData._id);
    }
    await optionsData.save();
  }

  if (menuSubCategory) {
    const menuSubCategoryData = await MenuSubCategory.findById(menuSubCategory);
    menuSubCategoryData.menuItems.push(menuItem._id);
    await menuSubCategoryData.save();
  } else {
    const menuCategoryData = await MenuCategory.findById(menuCategory);
    menuCategoryData.menuItems.push(menuItem._id);
    await menuCategoryData.save();
  }
  const menuItemTiming = await MenuItemTiming.create({
    menuItem: menuItem._id,
  });

  menuItem.timing = menuItemTiming._id;
  await menuItem.save();
  if (!restaurant.cuisines.includes(cuisine)) {
    restaurant.cuisines.push(cuisine);
  }
  if (!restaurant.categories.includes(category)) {
    restaurant.categories.push(category);
  }

  restaurant.menuItems.push(menuItem._id);

  await restaurant.save();
  res.status(200).json({
    menuItem,
    status: "success",
    message: "Menu item created successfully",
  });
});

exports.uploadImageMenuItem = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const file = req.file;
  const menuItem = await MenuItem.findById(menuItemId);
  const response = uploadImg(file);
  if (menuItem.image) {
    await deleteFile(menuItem.image);
  }
  menuItem.image = (await response).Key;
  await menuItem.save();
  res.status(200).json({
    menuItem,
    status: "success",
    message: "MenuItem image uploaded  successfully",
  });
});

exports.getSingleMenuItem = catchAsync(async (req, res, next) => {
  const { menuItemId } = req.query;
  const menuItem = await MenuItem.findById(menuItemId).populate([
    { path: "customizations", populate: "customizationItems" },
    { path: "addOns", populate: "addOnItems" },
    { path: "options", populate: "optionItems" },
    { path: "timing" },
    { path: "menuCategory", populate: "menuSubCategories" },
  ]);
  res
    .status(200)
    .json({ status: "success", message: "success", data: menuItem });
});

exports.getRestaurantItems = catchAsync(async (req, res, next) => {
  const { page, limit, restaurantId } = req.query;
  //   const skip = page * limit - limit;

  const restaurant = await Restaurant.findById(restaurantId)
    .populate("ordertypes")
    .populate("categories")
    .populate("parentcategories")
    .populate("taxes")
    .populate("attributes")
    .populate("variations")
    .populate("addongroups")
    .populate("items");
  const data = [];
  for (let index = 0; index < restaurant.categories.length; index++) {
    const element = restaurant.categories[index];
    data.push({
      ...element.toObject({ getters: true }),
      timeAvailable: true,
      items: [],
    });
  }
  const getAttribute = (id) => {
    for (let k = 0; k < restaurant.attributes.length; k++) {
      const attribute = restaurant.attributes[k];
      if (attribute.attributeid === id) {
        return attribute;
      }
    }
  };
  const getAddonGroupData = (id) => {
    for (let m = 0; m < restaurant.addongroups.length; m++) {
      const addongroup = restaurant.addongroups[m];
      if (addongroup.addongroupid === id) {
        return addongroup;
      }
    }
  };
  const getAddonData = (addons) => {
    const addon = [];
    for (let l = 0; l < addons.length; l++) {
      const element = addons[l];
      addon.push({
        ...element.toObject({ getters: true }),
        addonGroup: getAddonGroupData(element.addon_group_id),
      });
    }
    return addon;
  };

  const getParentCategory = (id) => {
    for (let l = 0; l < restaurant.parentcategories.length; l++) {
      const element = restaurant.parentcategories[l];
      console.log(id, element.id);
      if (id === element.id) {
        return { ...element.toObject({ getters: true }) };
      }
    }
  };

  const getVariationData = (variations) => {
    const data = [];
    for (let n = 0; n < variations.length; n++) {
      const variation = variations[n];
      data.push({
        ...variation.toObject({ getters: true }),
        addon: getAddonData(variation.addon),
      });
    }
    return data;
  };
  for (let index = 0; index < data.length; index++) {
    const categories = data[index];

    if (!(categories.parent_category_id === "0")) {
      categories.parent_category = getParentCategory(
        categories.parent_category_id
      );
    }
    for (let j = 0; j < restaurant.items.length; j++) {
      const element = restaurant.items[j];
      if (element.item_categoryid === categories.categoryid) {
        categories.items.push({
          ...element.toObject({ getters: true }),
          item_attribute: getAttribute(element.item_attributeid),
          addon: getAddonData(element.addon),
          variation: getVariationData(element.variation),
        });
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});

exports.setTimeForMenuItem = catchAsync(async (req, res, next) => {
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    req.body;
  const { menuItemTimingId } = req.query;

  const menuItemTiming = await MenuItemTiming.findById(menuItemTimingId);
  if (!menuItemTiming) {
    return next(new AppError("menuItemTimingId missing in query", 403));
  }
  if (sunday) {
    menuItemTiming.sunday = sunday;
  }
  if (monday) {
    menuItemTiming.monday = monday;
  }
  if (tuesday) {
    menuItemTiming.tuesday = tuesday;
  }
  if (wednesday) {
    menuItemTiming.wednesday = wednesday;
  }
  if (thursday) {
    menuItemTiming.thursday = thursday;
  }
  if (friday) {
    menuItemTiming.friday = friday;
  }
  if (saturday) {
    menuItemTiming.saturday = saturday;
  }

  await menuItemTiming.save();
  res.status(200).json({
    status: "success",
    message: "SuccessFully created",
  });
});

exports.updateAvailableOfMenuItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.query;
  const { inStock } = req.body;
  const menuItem = await Items.findByIdAndUpdate(itemId, { inStock });
  res.status(200).json({
    status: "success",
    message: "SuccessFully updated",
  });
});

exports.getAddon = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.query;

  const data = await Addongroups.find({ restaurant: restaurantId });
  res.status(200).json({
    status: "success",
    message: "SuccessFully ",
    data,
  });
});
