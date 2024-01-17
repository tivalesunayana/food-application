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

// exports.getRestaurant = catchAsync(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;

//   const restaurant = await Restaurant.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: req.customer.currentLocation.coordinates,
//         },
//         maxDistance: 2000 * 1000,
//         // maxDistance: 8 * 1000,

//         spherical: true,
//         distanceField: "distance",
//         // distanceMultiplier: 0.000621371,
//       },
//     },
//     { $match: { approved: true, appVisible: true } },

//     { $skip: skip },
//     { $limit: limit },
//   ]);
//   await Ordertypes.populate(restaurant, {
//     path: "ordertypes",
//     select: "ordertype ordertypeid",
//   });
//   await Attributes.populate(restaurant, {
//     path: "attributes",
//     select: "attribute",
//   });

//   const data = [];
//   // for (let index = 0; index < restaurants.length; index++) {
//   //   const element = restaurants[index];
//   //   data.push({
//   //     ...element.toObject({ getters: true }),
//   //   });
//   // }
//   res.status(200).json({
//     status: "success",
//     message: "successful",
//     data: restaurant,
//   });
// });
const axios = require("axios");

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  let customerLocation;

  if (
    req.customer.currentLocation &&
    req.customer.currentLocation.coordinates
  ) {
    customerLocation = req.customer.currentLocation.coordinates;
  }

  const [longitude, latitude] = customerLocation;

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
    );

    const city = extractCityNameFromResponse(response.data);

    const restaurant = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: customerLocation,
          },
          maxDistance: 2000 * 1000,
          spherical: true,
          distanceField: "distance",
        },
      },
      {
        $match: {
          approved: true,
          appVisible: true,

          city: city,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    await Ordertypes.populate(restaurant, {
      path: "ordertypes",
      select: "ordertype ordertypeid",
    });

    await Attributes.populate(restaurant, {
      path: "attributes",
      select: "attribute",
    });
    console.log(`city: ${city}`);
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved restaurants.",
      data: restaurant,
      city: city,
    });
  } catch (error) {
    console.error("Error in obtaining city information:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
});

function extractCityNameFromResponse(mapboxResponse) {
  // Extract the city name from the Mapbox Geocoding API response
  const features = mapboxResponse.features;
  if (features && features.length > 0) {
    for (const context of features[0].context) {
      if (context.id.startsWith("place") && context.text) {
        return context.text;
      }
    }
  }
  return null;
}
exports.getSingleRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.query.restaurantId);
  await Ordertypes.populate(restaurant, {
    path: "ordertypes",
    select: "ordertype ordertypeid",
  });
  console.log(`dfsd:${restaurant}`);
  await Attributes.populate(restaurant, {
    path: "attributes",
    select: "attribute",
  });

  res.status(200).json({
    status: "success",
    message: "successful",
    data: restaurant,
  });
});

//old code
// exports.searchRestaurants = catchAsync(async (req, res, next) => {
//   const query = req.query.search;
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;

//   const restaurant = await Restaurant.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: req.customer.currentLocation.coordinates,
//         },
//         maxDistance: 2000 * 1000,
//         spherical: true,
//         distanceField: "distance",
//         // distanceMultiplier: 0.000621371,
//       },
//     },
//     { $match: { approved: true, appVisible: true } },
//     {
//       $lookup: {
//         from: "items",
//         let: { pid: "$Items" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
//           { $match: { approved: true } },
//         ],
//         as: "items",
//       },
//     },

//     {
//       $lookup: {
//         from: "categories",
//         let: { caid: "$categories" },
//         pipeline: [{ $match: { $expr: { $in: ["$_id", "$$caid"] } } }],
//         as: "categories",
//       },
//     },

//     {
//       $match: {
//         $or: [
//           { brand_display_name: { $regex: new RegExp(query, "i") } },
//           { cuisines: { $regex: new RegExp(query, "i") } },
//           // { "items.itemname": { $regex: new RegExp(query, "i") } },

//           { "items.itemname": { $regex: new RegExp(query, "i") } },
//           // { "cuisines.title": { $regex: new RegExp(query, "i") } },
//           { "categories.categoryname": { $regex: new RegExp(query, "i") } },
//         ],
//       },
//     },

//     { $skip: skip },
//     { $limit: limit },
//   ]);
//   await Ordertypes.populate(restaurant, {
//     path: "ordertypes",
//     select: "ordertype ordertypeid",
//   });
//   await Attributes.populate(restaurant, {
//     path: "attributes",
//     select: "attribute",
//   });

//   res.status(200).json({ data: restaurant, status: "success" });
// });
// exports.searchRestaurants = catchAsync(async (req, res, next) => {
//   const query = req.query.search;
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;

//   let customerLocation;

//   // Check if the customer has provided coordinates in the request
//   if (
//     req.customer.currentLocation &&
//     req.customer.currentLocation.coordinates
//   ) {
//     customerLocation = req.customer.currentLocation.coordinates;
//   }

//   const [longitude, latitude] = customerLocation;

//   try {
//     const response = await axios.get(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
//     );

//     const city = extractCityNameFromResponse(response.data);
//     console.log(`city:${city}`);

//     if (!city) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "City not found" });
//     }

//     const restaurant = await Restaurant.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: customerLocation,
//           },
//           maxDistance: 2000 * 1000,
//           spherical: true,
//           distanceField: "distance",
//         },
//       },
//       {
//         $match: {
//           $and: [
//             { approved: true, appVisible: true },
//             { city: city },
//             {
//               $or: [
//                 { brand_display_name: { $regex: new RegExp(query, "i") } },
//                 { cuisines: { $regex: new RegExp(query, "i") } },
//                 // { "items.itemname": { $regex: new RegExp(query, "i") } }, // Remove this line
//                 {
//                   "categories.categoryname": { $regex: new RegExp(query, "i") },
//                 },
//               ],
//             },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: "items", // Replace with the actual name of your 'items' collection
//           localField: "items",
//           foreignField: "_id",
//           as: "itemsData",
//         },
//       },
//       {
//         $addFields: {
//           itemsData: {
//             $cond: {
//               if: { $gt: [{ $size: "$items" }, 0] },
//               then: "$itemsData",
//               else: [],
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           $or: [
//             { "itemsData.itemname": { $regex: new RegExp(query, "i") } },
//             // Add more conditions if needed
//           ],
//         },
//       },
//       { $skip: skip },
//       { $limit: limit },
//     ]);

//     console.log("City:", city);
//     console.log("Query:", query);
//     console.log(
//       "After $geoNear:",
//       restaurant.map((item) => item.items.map((i) => i.itemname))
//     );

//     await Ordertypes.populate(restaurant, {
//       path: "ordertypes",
//       select: "ordertype ordertypeid",
//     });

//     await Attributes.populate(restaurant, {
//       path: "attributes",
//       select: "attribute",
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Successfully retrieved restaurants.",
//       data: restaurant,
//       city: city,
//     });
//   } catch (error) {
//     console.error("Error in obtaining city information:", error.message);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error.",
//     });
//   }
// });
// exports.searchRestaurants = catchAsync(async (req, res, next) => {
//   const query = req.query.search;
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;

//   const restaurant = await Restaurant.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: req.customer.currentLocation.coordinates,
//         },
//         maxDistance: 2000 * 1000,
//         spherical: true,
//         distanceField: "distance",
//         // distanceMultiplier: 0.000621371,
//       },
//     },
//     { $match: { approved: true, appVisible: true } },
//     {
//       $lookup: {
//         from: "items",
//         let: { pid: "$Items" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
//           { $match: { approved: true } },
//         ],
//         as: "items",
//       },
//     },

//     {
//       $lookup: {
//         from: "categories",
//         let: { caid: "$categories" },
//         pipeline: [{ $match: { $expr: { $in: ["$_id", "$$caid"] } } }],
//         as: "categories",
//       },
//     },

//     {
//       $match: {
//         $or: [
//           { brand_display_name: { $regex: new RegExp(query, "i") } },
//           { cuisines: { $regex: new RegExp(query, "i") } },
//           // { "items.itemname": { $regex: new RegExp(query, "i") } },

//           { "items.itemname": { $regex: new RegExp(query, "i") } },
//           // { "cuisines.title": { $regex: new RegExp(query, "i") } },
//           { "categories.categoryname": { $regex: new RegExp(query, "i") } },
//         ],
//       },
//     },

//     { $skip: skip },
//     { $limit: limit },
//   ]);
//   await Ordertypes.populate(restaurant, {
//     path: "ordertypes",
//     select: "ordertype ordertypeid",
//   });
//   await Attributes.populate(restaurant, {
//     path: "attributes",
//     select: "attribute",
//   });

//   res.status(200).json({ data: restaurant, status: "success" });
// });
//live code 
// exports.searchRestaurants = catchAsync(async (req, res, next) => {
//   const query = req.query.search;
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;
//   let customerLocation;

//   if (
//     req.customer.currentLocation &&
//     req.customer.currentLocation.coordinates
//   ) {
//     customerLocation = req.customer.currentLocation.coordinates;
//   }

//   const [longitude, latitude] = customerLocation;

//   try {
//     const response = await axios.get(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
//     );

//     const city = extractCityNameFromResponse(response.data);
//     console.log(`city:${city}`);

//     if (!city) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "City not found" });
//     }

//     const restaurant = await Restaurant.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: req.customer.currentLocation.coordinates,
//           },
//           maxDistance: 2000 * 1000,
//           spherical: true,
//           distanceField: "distance",
//         },
//       },
//       { $match: { approved: true, appVisible: true, city: city } },
//       {
//         $lookup: {
//           from: "items",
//           let: { pid: "$Items" },
//           pipeline: [
//             { $match: { $expr: { $in: ["$_id", "$$pid"] } } },
//             { $match: { approved: true } },
//           ],
//           as: "items",
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           let: { caid: "$categories" },
//           pipeline: [{ $match: { $expr: { $in: ["$_id", "$$caid"] } } }],
//           as: "categories",
//         },
//       },
//       {
//         $match: {
//           $and: [
//             {
//               $or: [
//                 { brand_display_name: { $regex: new RegExp(query, "i") } },
//                 { cuisines: { $regex: new RegExp(query, "i") } },
//                 { "items.itemname": { $regex: new RegExp(query, "i") } },
//                 {
//                   "categories.categoryname": { $regex: new RegExp(query, "i") },
//                 },
//               ],
//             },
//           ],
//         },
//       },
//       { $skip: skip },
//       { $limit: limit },
//     ]);

//     console.log(
//       "After $geoNear:",
//       restaurant.map((categorie) =>
//         categorie.categories.map((i) => i.categoryname)
//       )
//     );
//     await Ordertypes.populate(restaurant, {
//       path: "ordertypes",
//       select: "ordertype ordertypeid",
//     });

//     await Attributes.populate(restaurant, {
//       path: "attributes",
//       select: "attribute",
//     });

//     res.status(200).json({ data: restaurant, status: "success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// });

//restaurnt api done 
exports.searchRestaurants = catchAsync(async (req, res, next) => {
  try {
  const query = req.query.search;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const customerLocation = req.customer.currentLocation?.coordinates || [];
    const [longitude, latitude] = customerLocation;
  const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
    );

    const city = extractCityNameFromResponse(response.data);

    const restaurant = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: req.customer.currentLocation.coordinates },
          maxDistance: 2000 * 1000,
          spherical: true,
          distanceField: 'distance',
          query: { approved: true, appVisible: true, city: city },
        },
      },
      { $match: { brand_display_name: { $regex: new RegExp(query, 'i') } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Batch population
    await Restaurant.populate(restaurant, [
      { path: 'ordertypes', select: 'ordertype ordertypeid' },
      { path: 'attributes', select: 'attribute' },
    ]);

    res.status(200).json({ data: restaurant, status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});
//item name
// exports.searchRestaurantsItem = catchAsync(async (req, res) => {
//   try {
//     const query = req.query.search;
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const customerLocation = req.customer.currentLocation?.coordinates || [];
//     const [longitude, latitude] = customerLocation;

//     const response = await axios.get(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
//     );
//     const city = extractCityNameFromResponse(response.data);
// console.log(`city:${city}`)
//     const matchingItems = await Items.find({ itemname: { $regex: new RegExp(query, 'i') } });
//     console.log(`matchingItems:${matchingItems}`)

//     const restaurantIds = matchingItems.map(item => item.restaurant);
//     console.log(`matchingItems:${matchingItems}`)

//     const restaurants = await Restaurant.aggregate([
//       {
//         $geoNear: {
//           near: { type: 'Point', coordinates: req.customer.currentLocation.coordinates },
//           maxDistance: 2000 * 1000,
//           spherical: true,
//           distanceField: 'distance',
//           query: { approved: true, appVisible: true, city: city, _id: { $in: restaurantIds } },
//         },
//       },
//       { $skip: (page - 1) * limit },
//       { $limit: limit },
//     ]);

//     // Batch population for the 'items' field
//     await Restaurant.populate(restaurants, { path: 'items', select: 'itemname' });

//     res.status(200).json({ data: restaurants, status: 'success' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// exports.searchRestaurantsItem = catchAsync(async (req, res) => {
//   const query = req.query.search;
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;

//   const customerLocation = req.customer.currentLocation?.coordinates || [];
//   const [longitude, latitude] = customerLocation;

//   const response = await axios.get(
//     `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
//   );
//   const city = extractCityNameFromResponse(response.data);

//   const restaurants = await Restaurant.aggregate([
//     {
//       $geoNear: {
//         near: { type: 'Point', coordinates: req.customer.currentLocation.coordinates },
//         maxDistance: 2000 * 1000,
//         spherical: true,
//         distanceField: 'distance',
//         query: { approved: true, appVisible: true, city: city },
//       },
//     },
//     {
//       $lookup: {
//         from: 'items',
//         let: { restaurantId: '$_id' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: ['$restaurant', '$$restaurantId'] },
//                   { $regexMatch: { input: '$itemname', regex: new RegExp(query, 'i') } },
//                 ],
//               },
//             },
//           },
//           { $match: { approved: true } },
//         ],
//         as: 'matchingItems',
//       },
//     },
    
//     {
//       $match: {
//         $or: [
//           { cuisines: { $regex: new RegExp(query, 'i') } },
//           { 'matchingItems.itemname': { $regex: new RegExp(query, 'i') } },
//         ],
//       },
//     },
//     { $skip: (page - 1) * limit },
//     { $limit: limit },
//   ]);
//         await Restaurant.populate(restaurants, { path: 'items', select: 'itemname' });

//       await Restaurant.populate(restaurants, [
//         { path: 'ordertypes', select: 'ordertype ordertypeid' },
//         { path: 'attributes', select: 'attribute' },
//       ]);
//   res.status(200).json({ data: restaurants, status: 'success' });
// });
exports.searchRestaurantsItem = catchAsync(async (req, res, next) => {
  const query = req.query.search;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  let customerLocation;

  if (
    req.customer.currentLocation &&
    req.customer.currentLocation.coordinates
  ) {
    customerLocation = req.customer.currentLocation.coordinates;
  }

  const [longitude, latitude] = customerLocation;

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
    );

    const city = extractCityNameFromResponse(response.data);
    

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: req.customer.currentLocation.coordinates,
          },
          maxDistance: 2000 * 1000,
          spherical: true,
          distanceField: "distance",
        },
      },
      { $match: { approved: true, appVisible: true, city: city } },
      {
        $lookup: {
          from: "items",
          localField: "items", 
          foreignField: "_id",
          as: "items",
        },
      },
      {
        $match: {
          $or: [
            { "items.itemname": { $regex: new RegExp(query, "i") } },
          ],
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

 

    await Restaurant.populate(restaurants, [
      { path: 'ordertypes', select: 'ordertype ordertypeid' },
      { path: 'attributes', select: 'attribute' },
    ]);
    res.status(200).json({ data: restaurants, status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


//old corrct code
// exports.filterRestaurants = catchAsync(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const { price, rating, deliveryTime, veg, cuisine } = req.body;

//   const skip = (page - 1) * limit;

//   const aggregateQuery = [
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: req.customer.currentLocation.coordinates,
//         },
//         maxDistance: 2000 * 1000,

//         spherical: true,
//         distanceField: "distance",
//         // distanceMultiplier: 0.000621371,
//       },
//     },

//     {
//       $lookup: {
//         from: "attributes",
//         let: { cid: "$attributes" },
//         pipeline: [{ $match: { $expr: { $in: ["$_id", "$$cid"] } } }],
//         as: "attributes",
//       },
//     },
//     {
//       $match: { approved: true, appVisible: true },
//     },

//     { $skip: skip },
//     { $limit: limit },
//   ];
//   if (rating && !price) {
//     aggregateQuery.push({ $sort: { rating: rating } });
//   } else if (price && rating) {
//     aggregateQuery.push({ $sort: { rating: rating } });
//   }
//   if (cuisine) {
//     aggregateQuery[2].$match = {
//       ...aggregateQuery[2].$match,
//       cuisines: { $regex: new RegExp(cuisine, "i") },
//     };
//   }
//   if (veg) {
//     aggregateQuery[2].$match = {
//       ...aggregateQuery[2].$match,
//       "attributes.attribute": { $regex: new RegExp("veg", "i") },
//     };
//   }
//   const restaurant = await Restaurant.aggregate(aggregateQuery);

//   // await Cuisine.populate(restaurant, { path: "cuisines" });
//   await Ordertypes.populate(restaurant, {
//     path: "ordertypes",
//     select: "ordertype ordertypeid",
//   });
//   await Attributes.populate(restaurant, {
//     path: "attributes",
//     select: "attribute",
//   });

//   res.status(200).json({ data: restaurant, status: "success" });
// });

exports.filterRestaurants = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const { price, rating, deliveryTime, veg, cuisine } = req.body;
  const skip = (page - 1) * limit;

  let customerLocation;
  if (
    req.customer.currentLocation &&
    req.customer.currentLocation.coordinates
  ) {
    customerLocation = req.customer.currentLocation.coordinates;
  }

  const [longitude, latitude] = customerLocation;

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
    );

    const city = extractCityNameFromResponse(response.data);

    const aggregateQuery = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: customerLocation,
          },
          maxDistance: 2000 * 1000,
          spherical: true,
          distanceField: "distance",
        },
      },
      {
        $lookup: {
          from: "attributes",
          let: { cid: "$attributes" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$cid"] } } }],
          as: "attributes",
        },
      },
      {
        $match: {
          approved: true,
          appVisible: true,
          city: city,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    if (rating && !price) {
      aggregateQuery.push({ $sort: { rating: rating } });
    } else if (price && rating) {
      aggregateQuery.push({ $sort: { rating: rating } });
    }

    if (cuisine) {
      aggregateQuery[2].$match = {
        ...aggregateQuery[2].$match,
        cuisines: { $regex: new RegExp(cuisine, "i") },
      };
    }

    if (veg) {
      aggregateQuery[2].$match = {
        ...aggregateQuery[2].$match,
        "attributes.attribute": { $regex: new RegExp("veg", "i") },
      };
    }

    const restaurant = await Restaurant.aggregate(aggregateQuery);

    await Ordertypes.populate(restaurant, {
      path: "ordertypes",
      select: "ordertype ordertypeid",
    });
    await Attributes.populate(restaurant, {
      path: "attributes",
      select: "attribute",
    });

    res.status(200).json({ data: restaurant, status: "success" });
  } catch (error) {
    console.error("Error in obtaining city information:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
});


