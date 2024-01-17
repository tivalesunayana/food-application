const Categories = require("../../models/categories/categoriesModel");
const ParentCategories = require("../../models/categories/parentcategoriesModel");
const Taxes = require("../../models/item/taxesModel");
const Addongroups = require("../../models/item/addongroupsModel");
const Attributes = require("../../models/item/attributesModel");
const Items = require("../../models/item/itemsModel");
const Variations = require("../../models/item/variationsModel");
const Ordertypes = require("../../models/restaurant/ordertypesModel");
const Restaurant = require("../../models/restaurant/restaurantModel");
const catchAsync = require("../../utils/catchAsync");

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
  console.log(`res:${restaurant.items}`);
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
  //sunayana

  for (let index = 0; index < data.length; index++) {
    const categories = data[index];

    if (!(categories.parent_category_id === "0")) {
      categories.parent_category = getParentCategory(
        categories.parent_category_id
      );
    }

    for (let j = 0; j < restaurant.items.length; j++) {
      const element = restaurant.items[j];

      // Check if the item is visible before adding it to the array
      if (
        element.item_categoryid === categories.categoryid &&
        element.itemVisible
      ) {
        categories.items.push({
          ...element.toObject({ getters: true }),
          item_attribute: getAttribute(element.item_attributeid),
          addon: getAddonData(element.addon),
          variation: getVariationData(element.variation),
        });
      }
    }
  }

  //sunayana
  res.status(200).json({
    status: "success",
    message: "successful",
    data,
  });
});
