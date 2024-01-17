const ParentCategories = require("../../models/categories/parentcategoriesModel");
const Taxes = require("../../models/item/taxesModel");
const Addongroups = require("../../models/item/addongroupsModel");
const Attributes = require("../../models/item/attributesModel");
const Items = require("../../models/item/itemsModel");
const Variations = require("../../models/item/variationsModel");
const Ordertypes = require("../../models/restaurant/ordertypesModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order/orderModel");
const DeliveryPartnerCurrentLocation = require("../../models/deliveryPartner/deliveryPartnerCurrentLocation");
const Payment = require("../../models/payment/paymentModel");
const SearchDeliveryPartner = require("../../models/order/searchDeliveryPartner");
const ItemOffData = require("../../models/cronJob/itemOffDataModel");
const RestaurantOffData = require("../../models/cronJob/restaurantOffDataModel");
const Categories = require("../../models/categories/categoriesModel");
const { uploadImg } = require("../../config/s3config");
const AppError = require("../../utils/appError");
// const { sendNotification } = require("../../config/firebase");
exports.createCategories = catchAsync(async (req, res, next) => {
  const { categoryname, categorytimings } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return new AppError("restaurant not found", 404);
  }
  const category = await Categories.create({
    active: "1",
    categoryrank: "1",
    parent_category_id: "0",
    categoryname,
    categorytimings: JSON.stringify(categorytimings),
    category_image_url: "",
    restaurant: restaurant._id,
  });
  category.categoryid = category._id.toString();
  restaurant.categories.push(category._id);
  await category.save();
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "category created successfully",
    data: category,
  });
});

// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const { categoryId } = req.query;
//   const { visibile } = req.body;
//   console.log(`categoryId`);
//   const category = await Categories.findById(categoryId);
//   category.visibile = visibile;
//   await category.save();
//   res.status(200).json({
//     status: "success",
//     message: "category app visible updated successfully",
//   });
// });

// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const { visible } = req.body;
//   const { categoryId } = req.query;

//   const category = await Categories.findByIdAndUpdate(categoryId, { visible });

//   res.status(200).json({
//     status: "success",
//     message: "successfully",
//     data: category,
//   });
// });
exports.deleteCategories = catchAsync(async (req, res, next) => {
  const { categoryId } = req.query;

  const category = await Categories.findById(categoryId);
  const items = await Items.find({ item_categoryid: categoryId });
  if (!(items.length === 0)) {
    res.status(404).json({
      status: "success",
      message: "Category has items",
      data: category,
    });
  } else {
    await Categories.findByIdAndDelete(categoryId);
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      data: category,
    });
  }
});

exports.editCategories = catchAsync(async (req, res, next) => {
  const { categoryname, categorytimings } = req.body;
  const { categoryId } = req.query;
  const category = await Categories.findById(categoryId);
  if (!category) {
    return new AppError("category not found", 404);
  }
  if (categoryname) {
    category.categoryname = categoryname;
  }
  if (categorytimings) {
    category.categorytimings = JSON.stringify(categorytimings);
  }
  await category.save();
  res.status(200).json({
    status: "success",
    message: "category edited successfully",
    data: category,
  });
});

exports.uploadCategoryImage = catchAsync(async (req, res, next) => {
  const file = req.file;
  const { categoryId } = req.query;
  const category = await Categories.findById(categoryId);
  if (!category) {
    return new AppError("category not found", 404);
  }
  const response = await uploadImg(file);
  category.category_image_url = response.Key;
  await category.save();
  res.status(200).json({
    status: "success",
    message: "category image upload successfully",
  });
});

exports.createVariations = catchAsync(async (req, res, next) => {
  const { name, groupname } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return new AppError("restaurant not found", 404);
  }
  const variation = await Variations.create({
    name,
    groupname,
    status: 1,
    restaurant: restaurant._id,
  });
  variation.variationid = variation._id.toString();
  restaurant.variations.push(variation._id);
  await variation.save();
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "variation created successfully",
    data: variation,
  });
});

exports.editVariations = catchAsync(async (req, res, next) => {
  const { name, groupname } = req.body;
  const { variationId } = req.query;
  const variation = await Variations.findById(variationId);
  if (!variation) {
    return new AppError("variation not found", 404);
  }
  if (name) {
    variation.name = name;
  }
  if (groupname) {
    variation.groupname = groupname;
  }
  await variation.save();
  res.status(200).json({
    status: "success",
    message: "variation edit successfully",
    data: variation,
  });
});

exports.createAddongroups = catchAsync(async (req, res, next) => {
  const { addongroup_name, addongroupitems } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return new AppError("restaurant not found", 404);
  }
  const addonGroup = await Addongroups.create({
    addongroup_rank: "1",
    active: "1",
    restaurant: restaurant._id,
    addongroup_name,
    addongroupitems,
  });
  for (let index = 0; index < addonGroup.addongroupitems.length; index++) {
    const element = addonGroup.addongroupitems[index];
    element.addonitemid = element._id;
  }

  addonGroup.addongroupid = addonGroup._id.toString();
  restaurant.addongroups.push(addonGroup._id);
  await addonGroup.save();
  await restaurant.save();
  res.status(200).json({
    status: "success",
    message: "addonGroup created successfully",
    data: addonGroup,
  });
});

exports.editAddongroups = catchAsync(async (req, res, next) => {
  const { addongroup_name, addongroupitems } = req.body;
  const { addonGroupId } = req.query;
  const addonGroup = await Addongroups.findById(addonGroupId);
  if (!addonGroup) {
    return new AppError("addonGroup not found", 404);
  }
  if (addongroup_name) {
    addonGroup.addongroup_name = addongroup_name;
  }
  addonGroup.addongroupitems = addongroupitems;
  for (let index = 0; index < addonGroup.addongroupitems.length; index++) {
    const element = addonGroup.addongroupitems[index];
    element.addonitemid = element._id;
  }
  await addonGroup.save();
  res.status(200).json({
    status: "success",
    message: "addonGroup edited successfully",
    data: addonGroup,
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const {
    item_categoryid,
    ybitesPackingCharges,
    itemallowaddon,
    itemaddonbasedon,
    item_favorite,
    variation_groupname,
    cuisine,
    item_attributeid,
    itemname,
    itemdescription,
    itemallowvariation,
    minimumpreparationtime,
    price,
    percentageTax,
    addon,
    variation,
  } = req.body;
  const { restaurantId } = req.query;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return new AppError("restaurant not found", 404);
  }
  const category = await Categories.findOne({ categoryid: item_categoryid });
  if (!category) {
    return new AppError("category not found", 404);
  }
  const attribute = await Attributes.findOne({ attributeid: item_attributeid });
  if (!attribute) {
    return new AppError("attribute not found", 404);
  }
  let item_tax = "";
  if (percentageTax === 5) {
    const taxes = await Taxes.find({ restaurant: restaurant._id, tax: "2.5" });
    for (let index = 0; index < taxes.length; index++) {
      const element = taxes[index];
      item_tax =
        item_tax === "" ? element.taxid : `${item_tax},${element.taxid}`;
    }
  } else if (percentageTax === 18) {
    const taxes = await Taxes.find({ restaurant: restaurant._id, tax: "9" });
    for (let index = 0; index < taxes.length; index++) {
      const element = taxes[index];
      item_tax =
        item_tax === "" ? element.taxid : `${item_tax},${element.taxid}`;
    }
  }
  const item = await Items.create({
    item_categoryid,
    ybitesPackingCharges,
    itemallowaddon,
    itemaddonbasedon,
    item_favorite,
    variation_groupname,
    cuisine,
    minimumpreparationtime,
    itemallowvariation,
    item_attributeid,
    itemname,
    itemdescription,
    price,
    item_tax,
    addon,
    variation,
    restaurant: restaurant._id,
  });
  for (let index = 0; index < item.variation.length; index++) {
    const element = item.variation[index];
    element.id = element._id;
  }
  item.itemid = item._id.toString();
  restaurant.items.push(item._id);
  await restaurant.save();
  await item.save();
  res.status(200).json({
    status: "success",
    message: "successfully item created",
    data: item,
  });
});

exports.editItem = catchAsync(async (req, res, next) => {
  const {
    item_categoryid,
    ybitesPackingCharges,
    itemallowaddon,
    itemaddonbasedon,
    item_favorite,
    variation_groupname,
    cuisine,
    item_attributeid,
    minimumpreparationtime,
    itemname,
    itemdescription,
    itemallowvariation,
    price,
    percentageTax,
    addon,
    variation,
  } = req.body;
  const { itemId } = req.query;
  const item = await Items.findById(itemId);

  if (!item) {
    return new AppError("item not found", 404);
  }
  const category = await Categories.findById(item_categoryid);
  if (!category) {
    return new AppError("category not found", 404);
  }
  const attribute = await Attributes.findById(item_attributeid);
  if (!attribute) {
    return new AppError("attribute not found", 404);
  }
  let item_tax = "";
  if (percentageTax === 5) {
    const taxes = await Taxes.find({
      restaurant: item.restaurant,
      tax: "2.5",
    });
    if (taxes.includes((e) => e.taxid === item.item_tax.split(",")[0])) {
      item_tax = item.item_tax;
      console.log("true");
    } else {
      for (let index = 0; index < taxes.length; index++) {
        const element = taxes[index];
        item_tax = item_tax === "" ? element._id : `${item_tax},${element._id}`;
      }
    }
  } else if (percentageTax === 18) {
    const taxes = await Taxes.find({ restaurant: item.restaurant, tax: "9" });
    if (taxes.includes((e) => e.taxid === item.item_tax.split(",")[0])) {
      item_tax = item.item_tax;
    } else {
      for (let index = 0; index < taxes.length; index++) {
        const element = taxes[index];
        item_tax = item_tax === "" ? element._id : `${item_tax},${element._id}`;
      }
    }
  }
  item.item_categoryid = item_categoryid;
  item.ybitesPackingCharges = ybitesPackingCharges;
  item.itemallowaddon = itemallowaddon;
  item.itemaddonbasedon = itemaddonbasedon;
  item.itemaddonbasedon = itemaddonbasedon;
  item.itemaddonbasedon = itemaddonbasedon;
  item.item_favorite = item_favorite;
  item.variation_groupname = variation_groupname;
  item.cuisine = cuisine;
  item.item_attributeid = item_attributeid;
  item.itemname = itemname;
  item.itemdescription = itemdescription;
  item.price = price;
  item.item_tax = item_tax;
  item.addon = addon;
  item.itemallowvariation = itemallowvariation;
  item.variation = variation;
  item.minimumpreparationtime = minimumpreparationtime;

  for (let index = 0; index < item.variation.length; index++) {
    const element = item.variation[index];
    element.id = element._id;
  }

  await item.save();
  res.status(200).json({
    status: "success",
    message: "Item edited successfully",
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Items.findById(req.query.itemId);
  const restaurant = await Restaurant.findById(item.restaurant);
  restaurant.items.pull(item._id);
  item.deleted = true;
  await restaurant.save();
  await item.save();
  res.status(200).json({
    status: "success",
    message: "item deleted successfully",
  });
});
// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const item = await Items.findById(req.query.itemId);
//   const restaurant = await Restaurant.findById(item.restaurant);
//   restaurant.items.pull(item._id);
//   item.itemVisible = true;
//   await restaurant.save();
//   await item.save();

//   res.status(200).json({
//     status: "success",
//     message: "successfully",
//   });
// });

// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const item = await Items.findById(req.query.itemId);

//   if (!item) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Item not found",
//     });
//   }

//   // Toggle the itemVisible property
//   item.itemVisible = !item.itemVisible;

//   await item.save();

//   res.status(200).json({
//     status: "success",
//     message: "Item visibility toggled successfully",
//     data: { itemVisible: item.itemVisible },
//   });
// });
// exports.visibleItem = catchAsync(async (req, res, next) => {
//   const { itemId } = req.query;
//   const { itemVisible } = req.body;

//   const item = await Items.findById(itemId);

//   item.itemVisible = itemVisible;

//   await item.save();

//   res.status(200).json({
//     status: "success",
//     message: "Item visibility updated successfully",
//     data: { itemVisible: item.itemVisible },
//   });
// });
exports.visibleItem = catchAsync(async (req, res, next) => {
  const items = await Items.findByIdAndUpdate(
    req.params.itemId,
    { itemVisible: req.body.itemVisible },
    { new: true }
  );
  res.status(200).json({
    items,
    status: "success",
    message: "itemVisible updated successfully",
  });
});

exports.uploadItemImage = catchAsync(async (req, res, next) => {
  const file = req.file;
  const { itemId } = req.query;
  const item = await Items.findById(itemId);
  if (!item) {
    return new AppError("item not found", 404);
  }
  const response = await uploadImg(file);
  item.item_image_url = response.Key;
  await item.save();
  res.status(200).json({
    status: "success",
    message: "item image upload successfully",
  });
});
