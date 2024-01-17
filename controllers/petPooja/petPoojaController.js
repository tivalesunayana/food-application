const Categories = require("../../models/categories/categoriesModel");
const { sendNotification } = require("../../config/firebase");

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
const get1min = () => {
  const d = new Date();
  // d.setMinutes(d.getMinutes() - 1);
  return new Date(d.getTime() - 1 * 60000);
  // return d;
};

exports.getMenuSharing = catchAsync(async (req, res, next) => {
  console.log(req.body.restaurants[0]);
  const bodyData = req.body;

  const restaurant = await Restaurant.findOne({
    outlet_id: bodyData.restaurants[0].details.menusharingcode,
  });
  console.log(restaurant);

  if (restaurant) {
    // restaurant.restaurantid = bodyData.restaurants[0].restaurantid;
    // restaurant.active = bodyData.restaurants[0].active;
    // restaurant.menusharingcode =
    //   bodyData.restaurants[0].details.menusharingcode;
    // restaurant.currency_html = bodyData.restaurants[0].details.currency_html;
    // restaurant.country = bodyData.restaurants[0].details.country;
    // restaurant.images = bodyData.restaurants[0].details.images;
    // restaurant.restaurantname = bodyData.restaurants[0].details.restaurantname;
    // restaurant.address = bodyData.restaurants[0].details.address;
    // restaurant.contact = bodyData.restaurants[0].details.contact;
    // restaurant.landmark = bodyData.restaurants[0].details.landmark;
    // restaurant.city = bodyData.restaurants[0].details.city;
    // restaurant.state = bodyData.restaurants[0].details.state;
    // restaurant.minimumorderamount =
    //   bodyData.restaurants[0].details.minimumorderamount;
    // restaurant.minimumdeliverytime =
    //   bodyData.restaurants[0].details.minimumdeliverytime;
    // restaurant.deliverycharge = bodyData.restaurants[0].details.deliverycharge;
    // restaurant.deliveryhoursfrom1 =
    //   bodyData.restaurants[0].details.deliveryhoursfrom1;
    // restaurant.deliveryhoursto1 =
    //   bodyData.restaurants[0].details.deliveryhoursto1;
    // restaurant.deliveryhoursfrom2 =
    //   bodyData.restaurants[0].details.deliveryhoursfrom2;
    // restaurant.deliveryhoursto2 =
    //   bodyData.restaurants[0].details.deliveryhoursto2;
    // restaurant.calculatetaxonpacking =
    //   bodyData.restaurants[0].details.calculatetaxonpacking;
    // restaurant.calculatetaxondelivery =
    //   bodyData.restaurants[0].details.calculatetaxondelivery;
    // restaurant.dc_taxes_id = bodyData.restaurants[0].details.dc_taxes_id;
    // restaurant.pc_taxes_id = bodyData.restaurants[0].details.pc_taxes_id;
    // restaurant.packaging_applicable_on =
    //   bodyData.restaurants[0].details.packaging_applicable_on;
    // restaurant.packaging_charge =
    //   bodyData.restaurants[0].details.packaging_charge;
    // restaurant.packaging_charge_type =
    //   bodyData.restaurants[0].details.packaging_charge_type;
    // restaurant.location = {
    //   type: "Point",
    //   coordinates: [
    //     bodyData.restaurants[0].details.longitude * 1,
    //     bodyData.restaurants[0].details.latitude * 1,
    //   ],
    // };

    // Ordertypes
    const restaurantOrderType = [];
    for (let index = 0; index < bodyData.ordertypes.length; index++) {
      const element = bodyData.ordertypes[index];
      const ordertype = await Ordertypes.findOne({
        restaurant: restaurant._id,
        ordertypeid: element.ordertypeid,
      });
      if (ordertype) {
        ordertype.ordertype = element.ordertype;
        await ordertype.save();
        restaurantOrderType.push(ordertype._id);
      } else {
        const newOrdertypeData = await Ordertypes.create({
          restaurant: restaurant._id,
          ordertypeid: element.ordertypeid,
          ordertype: element.ordertype,
        });
        restaurantOrderType.push(newOrdertypeData._id);
      }
    }
    restaurant.ordertypes = restaurantOrderType;
    // Ordertypes completed

    // categories
    const restaurantCategories = [];
    for (let index = 0; index < bodyData.categories.length; index++) {
      const element = bodyData.categories[index];
      const categories = await Categories.findOne({
        restaurant: restaurant._id,
        categoryid: element.categoryid,
      });
      if (categories) {
        categories.active = element.active;
        categories.categoryrank = element.categoryrank;
        categories.parent_category_id = element.parent_category_id;
        categories.categoryname = element.categoryname;
        categories.categorytimings = element.categorytimings;
        categories.category_image_url = element.category_image_url;
        categories.categoryrank = element.categoryrank;

        await categories.save();
        restaurantCategories.push(categories._id);
      } else {
        const newCategoriesData = await Categories.create({
          restaurant: restaurant._id,
          categoryid: element.categoryid,
          active: element.active,
          categoryrank: element.categoryrank,
          parent_category_id: element.parent_category_id,
          categoryname: element.categoryname,
          categorytimings: element.categorytimings,
          category_image_url: element.category_image_url,
          categoryrank: element.categoryrank,
        });
        restaurantCategories.push(newCategoriesData._id);
      }
    }
    restaurant.categories = restaurantCategories;
    // categories completed

    // Parentcategories
    const restaurantParentcategories = [];
    for (let index = 0; index < bodyData.parentcategories.length; index++) {
      const element = bodyData.parentcategories[index];
      const parentcategories = await ParentCategories.findOne({
        restaurant: restaurant._id,
        id: element.id,
      });
      if (parentcategories) {
        parentcategories.name = element.name;
        parentcategories.rank = element.rank;
        parentcategories.image_url = element.image_url;
        parentcategories.status = element.status;
        parentcategories.id = element.id;

        await parentcategories.save();
        restaurantParentcategories.push(parentcategories._id);
      } else {
        const newParentcategoriesData = await ParentCategories.create({
          restaurant: restaurant._id,
          name: element.name,
          rank: element.rank,
          image_url: element.image_url,
          status: element.status,
          id: element.id,
        });
        restaurantParentcategories.push(newParentcategoriesData._id);
      }
    }
    restaurant.parentcategories = restaurantParentcategories;
    // Parentcategories completed

    // attributes
    const restaurantAttributes = [];
    for (let index = 0; index < bodyData.attributes.length; index++) {
      const element = bodyData.attributes[index];
      const attributes = await Attributes.findOne({
        restaurant: restaurant._id,
        attributeid: element.attributeid,
      });
      if (attributes) {
        attributes.attributeid = element.attributeid;
        attributes.attribute = element.attribute;
        attributes.active = element.active;

        await attributes.save();
        restaurantAttributes.push(attributes._id);
      } else {
        const newattributesData = await Attributes.create({
          restaurant: restaurant._id,
          attributeid: element.attributeid,
          attribute: element.attribute,

          active: element.active,
        });
        restaurantAttributes.push(newattributesData._id);
      }
    }
    restaurant.attributes = restaurantAttributes;
    // attributes completed

    // taxes
    const restaurantTaxes = [];
    for (let index = 0; index < bodyData.taxes.length; index++) {
      const element = bodyData.taxes[index];
      const taxes = await Taxes.findOne({
        restaurant: restaurant._id,
        taxid: element.taxid,
      });
      if (taxes) {
        taxes.taxid = element.taxid;
        taxes.taxname = element.taxname;
        taxes.tax = element.tax;
        taxes.taxtype = element.taxtype;
        taxes.tax_ordertype = element.tax_ordertype;

        taxes.active = element.active;
        taxes.tax_coreortotal = element.tax_coreortotal;
        taxes.tax_taxtype = element.tax_taxtype;
        taxes.rank = element.rank;
        taxes.consider_in_core_amount = element.consider_in_core_amount;
        taxes.description = element.description;

        await taxes.save();
        restaurantTaxes.push(taxes._id);
      } else {
        const newTaxesData = await Taxes.create({
          restaurant: restaurant._id,
          taxid: element.taxid,
          taxname: element.taxname,
          tax: element.tax,
          taxtype: element.taxtype,
          tax_ordertype: element.tax_ordertype,

          active: element.active,
          tax_coreortotal: element.tax_coreortotal,
          tax_taxtype: element.tax_taxtype,
          rank: element.rank,
          consider_in_core_amount: element.consider_in_core_amount,
          description: element.description,
        });
        restaurantTaxes.push(newTaxesData._id);
      }
    }
    restaurant.taxes = restaurantTaxes;
    // taxes completed

    // Variations
    const restaurantVariations = [];
    for (let index = 0; index < bodyData.variations.length; index++) {
      const element = bodyData.variations[index];
      const variations = await Variations.findOne({
        restaurant: restaurant._id,
        variationid: element.variationid,
      });
      if (variations) {
        variations.variationid = element.variationid;
        variations.name = element.name;
        variations.groupname = element.groupname;
        variations.status = element.status;

        await variations.save();
        restaurantVariations.push(variations._id);
      } else {
        const newVariationsData = await Variations.create({
          restaurant: restaurant._id,
          variationid: element.variationid,
          name: element.name,
          groupname: element.groupname,
          status: element.status,
        });
        restaurantVariations.push(newVariationsData._id);
      }
    }
    restaurant.variations = restaurantVariations;
    // Variations completed

    // addongroups
    const restaurantAddongroups = [];
    for (let index = 0; index < bodyData.addongroups.length; index++) {
      const element = bodyData.addongroups[index];
      const addongroups = await Addongroups.findOne({
        restaurant: restaurant._id,
        addongroupid: element.addongroupid,
      });
      if (addongroups) {
        addongroups.addongroupid = element.addongroupid;
        addongroups.addongroup_rank = element.addongroup_rank;
        addongroups.active = element.active;
        addongroups.addongroupitems = element.addongroupitems;
        addongroups.addongroup_name = element.addongroup_name;

        await addongroups.save();
        restaurantAddongroups.push(addongroups._id);
      } else {
        const newAddongroupsData = await Addongroups.create({
          restaurant: restaurant._id,
          addongroupid: element.addongroupid,
          addongroup_rank: element.addongroup_rank,
          active: element.active,
          addongroupitems: element.addongroupitems,
          addongroup_name: element.addongroup_name,
        });
        restaurantAddongroups.push(newAddongroupsData._id);
      }
    }
    restaurant.addongroups = restaurantAddongroups;
    // addongroups completed

    // items
    const restaurantItems = [];
    for (let index = 0; index < bodyData.items.length; index++) {
      const element = bodyData.items[index];
      const items = await Items.findOne({
        restaurant: restaurant._id,
        itemid: element.itemid,
      });
      if (items) {
        items.itemid = element.itemid;
        items.itemallowvariation = element.itemallowvariation;
        items.itemrank = element.itemrank;
        items.item_categoryid = element.item_categoryid;
        items.item_ordertype = element.item_ordertype;
        items.item_packingcharges = element.item_packingcharges;
        items.itemallowaddon = element.itemallowaddon;
        items.itemaddonbasedon = element.itemaddonbasedon;
        items.item_favorite = element.item_favorite;
        items.ignore_taxes = element.ignore_taxes;
        items.ignore_discounts = element.ignore_discounts;
        items.in_stock = element.in_stock;
        items.variation_groupname = element.variation_groupname;
        items.variation = element.variation;
        items.addon = element.addon;
        items.itemname = element.itemname;
        items.item_attributeid = element.item_attributeid;
        items.itemdescription = element.itemdescription;
        items.minimumpreparationtime = element.minimumpreparationtime;
        items.price = element.price;
        items.active = element.active;
        items.item_image_url = element.item_image_url;
        items.item_tax = element.item_tax;
        items.cuisine = element.cuisine;
        items.gst_type = element.gst_type;

        await items.save();
        restaurantItems.push(items._id);
      } else {
        const newItemsData = await Items.create({
          restaurant: restaurant._id,
          itemid: element.itemid,
          itemallowvariation: element.itemallowvariation,
          itemrank: element.itemrank,
          cuisine: element.cuisine,

          item_categoryid: element.item_categoryid,
          item_ordertype: element.item_ordertype,
          item_packingcharges: element.item_packingcharges,
          itemallowaddon: element.itemallowaddon,
          itemaddonbasedon: element.itemaddonbasedon,
          item_favorite: element.item_favorite,
          ignore_taxes: element.ignore_taxes,
          ignore_discounts: element.ignore_discounts,
          in_stock: element.in_stock,
          variation_groupname: element.variation_groupname,
          variation: element.variation,
          addon: element.addon,
          itemname: element.itemname,
          item_attributeid: element.item_attributeid,
          itemdescription: element.itemdescription,
          minimumpreparationtime: element.minimumpreparationtime,
          price: element.price,
          active: element.active,
          item_image_url: element.item_image_url,
          item_tax: element.item_tax,
          gst_type: element.gst_type,
        });
        restaurantItems.push(newItemsData._id);
      }
    }
    restaurant.items = restaurantItems;
    // items completed

    await restaurant.save();
  }
  // else {
  //   const newRestaurant = await Restaurant.create({
  //     restaurantid: bodyData.restaurants[0].restaurantid,
  //     active: bodyData.restaurants[0].active,
  //     menusharingcode: bodyData.restaurants[0].details.menusharingcode,
  //     currency_html: bodyData.restaurants[0].details.currency_html,
  //     country: bodyData.restaurants[0].details.country,
  //     images: bodyData.restaurants[0].details.images,
  //     restaurantname: bodyData.restaurants[0].details.restaurantname,
  //     address: bodyData.restaurants[0].details.address,
  //     contact: bodyData.restaurants[0].details.contact,
  //     //   latitude: bodyData.restaurants[0].details.latitude,
  //     //   longitude: bodyData.restaurants[0].details.longitude,
  //     landmark: bodyData.restaurants[0].details.landmark,
  //     city: bodyData.restaurants[0].details.city,
  //     state: bodyData.restaurants[0].details.state,
  //     minimumorderamount: bodyData.restaurants[0].details.minimumorderamount,
  //     minimumdeliverytime: bodyData.restaurants[0].details.minimumdeliverytime,
  //     deliverycharge: bodyData.restaurants[0].details.deliverycharge,
  //     deliveryhoursfrom1: bodyData.restaurants[0].details.deliveryhoursfrom1,
  //     deliveryhoursto1: bodyData.restaurants[0].details.deliveryhoursto1,
  //     deliveryhoursfrom2: bodyData.restaurants[0].details.deliveryhoursfrom2,
  //     deliveryhoursto2: bodyData.restaurants[0].details.deliveryhoursto2,
  //     calculatetaxonpacking:
  //       bodyData.restaurants[0].details.calculatetaxonpacking,
  //     calculatetaxondelivery:
  //       bodyData.restaurants[0].details.calculatetaxondelivery,
  //     dc_taxes_id: bodyData.restaurants[0].details.dc_taxes_id,
  //     pc_taxes_id: bodyData.restaurants[0].details.pc_taxes_id,
  //     packaging_applicable_on:
  //       bodyData.restaurants[0].details.packaging_applicable_on,
  //     packaging_charge: bodyData.restaurants[0].details.packaging_charge,
  //     packaging_charge_type:
  //       bodyData.restaurants[0].details.packaging_charge_type,
  //     location: {
  //       type: "Point",
  //       coordinates: [
  //         bodyData.restaurants[0].details.longitude * 1,
  //         bodyData.restaurants[0].details.latitude * 1,
  //       ],
  //     },
  //   });
  //   // Ordertypes
  //   const restaurantOrderType = [];
  //   for (let index = 0; index < bodyData.ordertypes.length; index++) {
  //     const element = bodyData.ordertypes[index];
  //     const ordertype = await Ordertypes.findOne({
  //       restaurant: newRestaurant._id,
  //       ordertypeid: element.ordertypeid,
  //     });
  //     if (ordertype) {
  //       ordertype.ordertype = element.ordertype;
  //       await ordertype.save();
  //       restaurantOrderType.push(ordertype._id);
  //     } else {
  //       const newOrdertypeData = await Ordertypes.create({
  //         restaurant: newRestaurant._id,
  //         ordertypeid: element.ordertypeid,
  //         ordertype: element.ordertype,
  //       });
  //       restaurantOrderType.push(newOrdertypeData._id);
  //     }
  //   }
  //   newRestaurant.ordertypes = restaurantOrderType;
  //   // Ordertypes completed

  //   // categories
  //   const restaurantCategories = [];
  //   for (let index = 0; index < bodyData.categories.length; index++) {
  //     const element = bodyData.categories[index];
  //     const categories = await Categories.findOne({
  //       restaurant: newRestaurant._id,
  //       categoryid: element.categoryid,
  //     });
  //     if (categories) {
  //       categories.active = element.active;
  //       categories.categoryrank = element.categoryrank;
  //       categories.parent_category_id = element.parent_category_id;
  //       categories.categoryname = element.categoryname;
  //       categories.categorytimings = element.categorytimings;
  //       categories.category_image_url = element.category_image_url;
  //       categories.categoryrank = element.categoryrank;

  //       await categories.save();
  //       restaurantCategories.push(categories._id);
  //     } else {
  //       const newCategoriesData = await Categories.create({
  //         restaurant: newRestaurant._id,
  //         active: element.active,
  //         categoryid: element.categoryid,
  //         categoryrank: element.categoryrank,
  //         parent_category_id: element.parent_category_id,
  //         categoryname: element.categoryname,
  //         categorytimings: element.categorytimings,
  //         category_image_url: element.category_image_url,
  //         categoryrank: element.categoryrank,
  //       });
  //       restaurantCategories.push(newCategoriesData._id);
  //     }
  //   }
  //   newRestaurant.categories = restaurantCategories;
  //   // categories completed

  //   // Parentcategories
  //   const restaurantParentcategories = [];
  //   for (let index = 0; index < bodyData.parentcategories.length; index++) {
  //     const element = bodyData.parentcategories[index];
  //     const parentcategories = await ParentCategories.findOne({
  //       restaurant: newRestaurant._id,
  //       id: element.id,
  //     });
  //     if (parentcategories) {
  //       parentcategories.name = element.name;
  //       parentcategories.rank = element.rank;
  //       parentcategories.image_url = element.image_url;
  //       parentcategories.status = element.status;
  //       parentcategories.id = element.id;

  //       await parentcategories.save();
  //       restaurantParentcategories.push(parentcategories._id);
  //     } else {
  //       const newParentcategoriesData = await ParentCategories.create({
  //         restaurant: newRestaurant._id,
  //         name: element.name,
  //         rank: element.rank,
  //         image_url: element.image_url,
  //         status: element.status,
  //         id: element.id,
  //       });
  //       restaurantParentcategories.push(newParentcategoriesData._id);
  //     }
  //   }
  //   newRestaurant.parentcategories = restaurantParentcategories;
  //   // Parentcategories completed

  //   // attributes
  //   const restaurantAttributes = [];
  //   for (let index = 0; index < bodyData.attributes.length; index++) {
  //     const element = bodyData.attributes[index];
  //     const attributes = await Attributes.findOne({
  //       restaurant: newRestaurant._id,
  //       attributeid: element.attributeid,
  //     });
  //     if (attributes) {
  //       attributes.attributeid = element.attributeid;
  //       attributes.attribute = element.attribute;
  //       attributes.active = element.active;

  //       await attributes.save();
  //       restaurantAttributes.push(attributes._id);
  //     } else {
  //       const newattributesData = await Attributes.create({
  //         restaurant: newRestaurant._id,
  //         attributeid: element.attributeid,
  //         active: element.active,
  //       });
  //       restaurantAttributes.push(newattributesData._id);
  //     }
  //   }
  //   newRestaurant.attributes = restaurantAttributes;
  //   // attributes completed

  //   // taxes
  //   const restaurantTaxes = [];
  //   for (let index = 0; index < bodyData.taxes.length; index++) {
  //     const element = bodyData.taxes[index];
  //     const taxes = await Taxes.findOne({
  //       restaurant: newRestaurant._id,
  //       taxid: element.taxid,
  //     });
  //     if (taxes) {
  //       taxes.taxid = element.taxid;
  //       taxes.taxname = element.taxname;
  //       taxes.tax = element.tax;
  //       taxes.taxtype = element.taxtype;
  //       taxes.tax_ordertype = element.tax_ordertype;

  //       taxes.active = element.active;
  //       taxes.tax_coreortotal = element.tax_coreortotal;
  //       taxes.tax_taxtype = element.tax_taxtype;
  //       taxes.rank = element.rank;
  //       taxes.consider_in_core_amount = element.consider_in_core_amount;
  //       taxes.description = element.description;

  //       await taxes.save();
  //       restaurantTaxes.push(taxes._id);
  //     } else {
  //       const newTaxesData = await Taxes.create({
  //         restaurant: newRestaurant._id,
  //         taxid: element.taxid,
  //         taxname: element.taxname,
  //         tax: element.tax,
  //         taxtype: element.taxtype,
  //         tax_ordertype: element.tax_ordertype,

  //         active: element.active,
  //         tax_coreortotal: element.tax_coreortotal,
  //         tax_taxtype: element.tax_taxtype,
  //         rank: element.rank,
  //         consider_in_core_amount: element.consider_in_core_amount,
  //         description: element.description,
  //       });
  //       restaurantTaxes.push(newTaxesData._id);
  //     }
  //   }
  //   newRestaurant.taxes = restaurantTaxes;
  //   // taxes completed

  //   // Variations
  //   const restaurantVariations = [];
  //   for (let index = 0; index < bodyData.variations.length; index++) {
  //     const element = bodyData.variations[index];
  //     const variations = await Variations.findOne({
  //       restaurant: newRestaurant._id,
  //       variationid: element.variationid,
  //     });
  //     if (variations) {
  //       variations.variationid = element.variationid;
  //       variations.name = element.name;
  //       variations.groupname = element.groupname;
  //       variations.status = element.status;

  //       await variations.save();
  //       restaurantVariations.push(variations._id);
  //     } else {
  //       const newVariationsData = await Variations.create({
  //         restaurant: newRestaurant._id,
  //         variationid: element.variationid,
  //         name: element.name,
  //         groupname: element.groupname,
  //         status: element.status,
  //       });
  //       restaurantVariations.push(newVariationsData._id);
  //     }
  //   }
  //   newRestaurant.variations = restaurantVariations;
  //   // Variations completed

  //   // addongroups
  //   const restaurantAddongroups = [];
  //   for (let index = 0; index < bodyData.addongroups.length; index++) {
  //     const element = bodyData.addongroups[index];
  //     const addongroups = await Addongroups.findOne({
  //       restaurant: newRestaurant._id,
  //       addongroupid: element.addongroupid,
  //     });
  //     if (addongroups) {
  //       addongroups.addongroupid = element.addongroupid;
  //       addongroups.addongroup_rank = element.addongroup_rank;
  //       addongroups.active = element.active;
  //       addongroups.addongroupitems = element.addongroupitems;
  //       addongroups.addongroup_name = element.addongroup_name;

  //       await addongroups.save();
  //       restaurantAddongroups.push(addongroups._id);
  //     } else {
  //       const newAddongroupsData = await Addongroups.create({
  //         restaurant: newRestaurant._id,
  //         addongroupid: element.addongroupid,
  //         addongroup_rank: element.addongroup_rank,
  //         active: element.active,
  //         addongroupitems: element.addongroupitems,
  //         addongroup_name: element.addongroup_name,
  //       });
  //       restaurantAddongroups.push(newAddongroupsData._id);
  //     }
  //   }
  //   newRestaurant.addongroups = restaurantAddongroups;
  //   // addongroups completed

  //   // items
  //   const restaurantItems = [];
  //   for (let index = 0; index < bodyData.items.length; index++) {
  //     const element = bodyData.items[index];
  //     const items = await Items.findOne({
  //       restaurant: newRestaurant._id,
  //       itemid: element.itemid,
  //     });
  //     if (items) {
  //       items.itemid = element.itemid;
  //       items.itemallowvariation = element.itemallowvariation;
  //       items.itemrank = element.itemrank;
  //       items.cuisine = element.cuisine;

  //       items.item_categoryid = element.item_categoryid;
  //       items.item_ordertype = element.item_ordertype;
  //       items.item_packingcharges = element.item_packingcharges;
  //       items.itemallowaddon = element.itemallowaddon;
  //       items.itemaddonbasedon = element.itemaddonbasedon;
  //       items.item_favorite = element.item_favorite;
  //       items.ignore_taxes = element.ignore_taxes;
  //       items.ignore_discounts = element.ignore_discounts;
  //       items.in_stock = element.in_stock;
  //       items.variation_groupname = element.variation_groupname;
  //       items.variation = element.variation;
  //       items.addon = element.addon;
  //       items.itemname = element.itemname;
  //       items.item_attributeid = element.item_attributeid;
  //       items.itemdescription = element.itemdescription;
  //       items.minimumpreparationtime = element.minimumpreparationtime;
  //       items.price = element.price;
  //       items.active = element.active;
  //       items.item_image_url = element.item_image_url;
  //       items.item_tax = element.item_tax;
  //       items.gst_type = element.gst_type;

  //       await items.save();
  //       restaurantItems.push(items._id);
  //     } else {
  //       const newItemsData = await Items.create({
  //         restaurant: newRestaurant._id,
  //         cuisine: element.cuisine,
  //         itemid: element.itemid,

  //         itemallowvariation: element.itemallowvariation,
  //         itemrank: element.itemrank,
  //         item_categoryid: element.item_categoryid,
  //         item_ordertype: element.item_ordertype,
  //         item_packingcharges: element.item_packingcharges,
  //         itemallowaddon: element.itemallowaddon,
  //         itemaddonbasedon: element.itemaddonbasedon,
  //         item_favorite: element.item_favorite,
  //         ignore_taxes: element.ignore_taxes,
  //         ignore_discounts: element.ignore_discounts,
  //         in_stock: element.in_stock,
  //         variation_groupname: element.variation_groupname,
  //         variation: element.variation,
  //         addon: element.addon,
  //         itemname: element.itemname,
  //         item_attributeid: element.item_attributeid,
  //         itemdescription: element.itemdescription,
  //         minimumpreparationtime: element.minimumpreparationtime,
  //         price: element.price,
  //         active: element.active,
  //         item_image_url: element.item_image_url,
  //         item_tax: element.item_tax,
  //         gst_type: element.gst_type,
  //       });
  //       restaurantItems.push(newItemsData._id);
  //     }
  //   }
  //   newRestaurant.items = restaurantItems;
  //   // items completed
  //   await newRestaurant.save();
  // }
  res.status(200).json({
    success: "1",
    message: "Menu items are successfully listed.",
  });
});

exports.menuItemOn = catchAsync(async (req, res, next) => {
  const { itemID } = req.body;
  console.log(req.body);
  for (let index = 0; index < itemID.length; index++) {
    const element = itemID[index];
    const item = await Items.findOne({ itemid: element });
    item.inStock = true;
    await item.save();
  }
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Stock status updated successfully",
  });
});

exports.menuItemOff = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { itemID, customTurnOnTime, restID } = req.body;
  const openTime = new Date(`${customTurnOnTime} GMT+0530`);
  const restaurant = await Restaurant.findOne({
    outlet_id: restID,
  });

  for (let index = 0; index < itemID.length; index++) {
    const element = itemID[index];
    const item = await Items.findOne({ itemid: element });
    await ItemOffData.create({
      item: item._id,
      openTime: openTime,
      restaurant: restaurant._id,
    });
    item.inStock = false;
    await item.save();
  }
  res.status(200).json({
    code: "200",
    status: "success",
    message: "Stock status updated successfully",
  });
});

exports.getCallBackUpdateOrder = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { status, orderID, minimum_prep_time, cancel_reason } = req.body;
  if (status === "1" || status === "2" || status === "3") {
    const order = await Order.findOne({ orderId: orderID })
      .populate("customer")
      .populate("restaurant");
    if (!order) {
      return next(new AppError("No order found", 404));
    }
    // console.log(order.restaurant.location.coordinates);

    sendNotification(
      "Your order is preparing",
      // "body",
      "Tap to Open",

      order.customer.notificationToken,
      { orderUpdate: order._id.toString() }
    );
    if (minimum_prep_time) {
      order.preparationTime = minimum_prep_time;
    }
    order.acceptedAt = new Date();
    const findNearestDeliveryPartner =
      await DeliveryPartnerCurrentLocation.find({
        location: {
          $near: {
            $maxDistance: 8 * 1000,
            $geometry: {
              type: "Point",
              coordinates: order.restaurant.location.coordinates,
            },
          },
        },
        available: true,
        locationUpdatedAt: { $gt: new Date(get1min()) },
      }).limit(10);
    console.log(
      "findNearestDeliveryPartner",
      findNearestDeliveryPartner.length
    );
    const availableDeliveryPartner = [];
    for (let index = 0; index < findNearestDeliveryPartner.length; index++) {
      const element = findNearestDeliveryPartner[index];
      availableDeliveryPartner.push(element.deliveryPartner);
    }
    await SearchDeliveryPartner.create({
      order: order._id,
      availableDeliveryPartner,
    });
    order.status = "Preparing";
    await order.save();
    res.status(200).json({
      success: "1",
      message: "Menu items are successfully listed.",
    });
  } else if (status === "-1") {
    const order = await Order.findOne({ orderId: orderID }).populate(
      "customer"
    );
    if (!order) {
      return next(new AppError("No order found", 404));
    }

    order.rejectAt = new Date();

    order.status = "Reject";
    order.rejectionReject = cancel_reason;

    await order.save();

    sendNotification(
      "Your order is Rejected",
      `Rejection due to ${cancel_reason}`,
      order.customer.notificationToken,
      { orderUpdate: order._id.toString() }
    );
    res.status(200).json({
      success: "1",
      message: "Menu items are successfully listed.",
    });
  } else if (status === "5") {
    const order = await Order.findOne({ orderId: orderID }).populate(
      "customer"
    );
    if (!order) {
      return next(new AppError("No order found", 404));
    }

    sendNotification(
      "Your order is Ready",
      // "body",
      "Tap to Open",

      order.customer.notificationToken,
      { orderUpdate: order._id.toString() }
    );
    order.readyAt = Date.now();
    order.status = "Ready";
    await order.save();
    res.status(200).json({
      success: "1",
      message: "Menu items are successfully listed.",
    });
  }
});

exports.getStoreUpdate = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { restID } = req.body;
  const restaurant = await Restaurant.findOne({ outlet_id: restID });

  res.status(200).json({
    http_code: 200,
    status: "success",
    store_status: restaurant.open ? "1" : "0",
    message: `Store Delivery Status fetched successfully`,
  });
});

exports.storeUpdate = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { restID, store_status, reason, turn_on_time } = req.body;
  const restaurant = await Restaurant.findOne({ outlet_id: restID });
  if (store_status === 1) {
    restaurant.open = true;
  } else {
    const openTime = new Date(`${turn_on_time} GMT+0530`);
    restaurant.open = false;
    await RestaurantOffData.create({
      openTime,
      restaurant: restaurant._id,
    });
  }
  await restaurant.save();
  // RestaurantOffData
  res.status(200).json({
    http_code: 200,
    status: "success",
    message: `Store Status updated successfully for store ${restID}`,
  });
});

exports.restaurantOnboarding = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {
    request_type,
    outlet_id,
    brand_display_name,
    owner_name,
    outlet_name,
    address,
    landmark,
    area,
    state,
    pincode,
    city,
    business_contact,
    merchant_number,
    email,
    is_support_self_delivery,
    serving_radius,
    fssai_no,
    fssai_image,
    pan_no,
    pan_image,
    aadhar_no,
    aadhar_image,
    gst_no,
    gst_image,
    restaurant_logo,
    cuisines,
    res_timings,
    long,
    lat,
  } = req.body;
  if (request_type === "1") {
    const findRestaurant = await Restaurant.findOne({ outlet_id: outlet_id });
    if (findRestaurant) {
      res.status(200).json({
        status: "0",
        message: "Mapping unsuccessful.",
      });
    } else {
      const restaurant = await Restaurant.create({
        outlet_id,
        brand_display_name,
        owner_name,
        outlet_name,
        address,
        landmark,
        area,
        state,
        pincode,
        city,
        business_contact,
        merchant_number,
        email,
        is_support_self_delivery,
        serving_radius,
        fssai_no,
        fssai_image,
        pan_no,
        pan_image,
        aadhar_no,
        aadhar_image,
        gst_no,
        gst_image,
        restaurant_logo,
        cuisines,
        res_timings,
        petPooja: true,
        location: {
          type: "Point",
          coordinates: [long * 1, lat * 1],
        },
      });
      res.status(200).json({
        status: "1",
        message: "Mapping successful.",
      });
    }
  } else if (request_type === "2") {
    const findRestaurant = await Restaurant.findOne({ outlet_id: outlet_id });
    if (findRestaurant) {
      findRestaurant.outlet_id = outlet_id;
      findRestaurant.brand_display_name = brand_display_name;
      findRestaurant.owner_name = owner_name;
      findRestaurant.outlet_name = outlet_name;
      findRestaurant.address = address;
      findRestaurant.landmark = landmark;
      findRestaurant.area = area;
      findRestaurant.state = state;
      findRestaurant.pincode = pincode;
      findRestaurant.city = city;
      findRestaurant.business_contact = business_contact;
      findRestaurant.merchant_number = merchant_number;
      findRestaurant.email = email;
      findRestaurant.is_support_self_delivery = is_support_self_delivery;
      findRestaurant.serving_radius = serving_radius;
      findRestaurant.fssai_no = fssai_no;
      findRestaurant.fssai_image = fssai_image;
      findRestaurant.pan_no = pan_no;
      findRestaurant.pan_image = pan_image;
      findRestaurant.aadhar_no = aadhar_no;
      findRestaurant.aadhar_image = aadhar_image;
      findRestaurant.gst_no = gst_no;
      findRestaurant.gst_image = gst_image;
      findRestaurant.restaurant_logo = restaurant_logo;
      findRestaurant.cuisines = cuisines;
      findRestaurant.res_timings = res_timings;

      await findRestaurant.save();
      res.status(200).json({
        status: "1",
        message: "Mapping successful.",
      });
    } else {
      res.status(200).json({
        status: "0",
        message: "Restaurant Id not found.",
      });
    }
  } else {
    res.status(200).json({
      status: "0",
      message: "Mapping unsuccessful.",
    });
  }
});
