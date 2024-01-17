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
const Cart = require("../../models/cart/cartModel");
const CartItem = require("../../models/cart/cartItemModel");
const { default: mongoose } = require("mongoose");
const Address = require("../../models/address/addressModel");
const axios = require("axios");
const Coupon = require("../../models/offer/couponModal");
const Order = require("../../models/order/orderModel");
const AppError = require("../../utils/appError");

exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { itemId, variationId, quantity, variationAddonsIds, addonsIds } =
    req.body;
  const item = await Items.findById(itemId);
  const cart = await Cart.findOne({
    customer: req.customer._id,
  }).populate("cartItems");

  if (cart) {
    // console.log(item.restaurant, cart.restaurant);
    if (item.restaurant.equals(cart.restaurant)) {
      const cartItems = await CartItem.create({
        item: item._id,
        quantity: quantity * 1,
        cart: cart._id,
        variation: variationId,
        variationAddons: variationAddonsIds,
        addons: addonsIds,
      });
      cart.cartItems.push(cartItems._id);
      await cart.save();
    } else {
      // console.log("r change");
      await CartItem.deleteMany({ cart: cart._id });
      cart.deliveryTip = 0;
      const cartItems = await CartItem.create({
        item: item._id,
        quantity: quantity * 1,
        cart: cart._id,
        variation: variationId,
        variationAddons: variationAddonsIds,
        addons: addonsIds,
      });

      cart.restaurant = item.restaurant;
      cart.cartItems.push(cartItems._id);
      await cart.save();
    }
    res.status(200).json({
      message: "successfully add to cart",
      status: "success",
      // data: cart,
    });
  } else {
    const newCart = await Cart.create({ customer: req.customer._id });
    const cartItems = await CartItem.create({
      item: item._id,
      quantity: quantity * 1,
      cart: newCart._id,
      variation: variationId,
      variationAddons: variationAddonsIds,
      addons: addonsIds,
    });
    newCart.cartItems.push(cartItems._id);
    newCart.restaurant = item.restaurant;
    await newCart.save();
    res.status(200).json({
      message: "successfully add to cart",
      status: "success",
      // data: cart,
    });
  }
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.query;
  const cartItem = await CartItem.findById(cartItemId);
  const cart = await Cart.findById(cartItem.cart);
  cart.cartItems.pull(cartItem._id);
  await cart.save();
  await CartItem.findByIdAndDelete(cartItem._id);
  res.status(200).json({ message: "Deleted successfully ", status: "success" });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { cartItemId, variationId, variationAddonsIds, addonsIds, quantity } =
    req.body;
  await CartItem.findByIdAndUpdate(cartItemId, {
    variation: variationId,
    variationAddons: variationAddonsIds,
    addons: addonsIds,
    quantity,
  });
  res.status(200).json({ message: "Updated successfully", status: "success" });
});

exports.normalCart = catchAsync(async (req, res, next) => {
  const { addressId, deliveryTip } = req.body;
  const cart = await Cart.findOne({
    customer: req.customer._id,
  })
    .populate({ path: "cartItems", populate: "item" })
    .populate({ path: "coupon" })
    .populate({
      path: "restaurant",
      select: "outlet_name restaurant_logo",
    });

  if (deliveryTip) {
    cart.deliveryTip = deliveryTip;
    await cart.save();
  }
  const calculateTax = async (taxString, price, quantity) => {
    const taxesArray = taxString.split(",");
    let taxes = { taxPrice: 0 };
    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      taxes[tax.taxname] = (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.taxPrice =
        taxes.taxPrice + (Number(tax.tax) * (Number(price) * quantity)) / 100;
    }
    return taxes;
  };

  const calculateTaxForExtra = async (taxString, price, quantity, taxes) => {
    const taxesArray = taxString.split(",");

    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      taxes[tax.taxname] =
        taxes[tax.taxname] +
        (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.taxPrice =
        taxes.taxPrice + (Number(tax.tax) * (Number(price) * quantity)) / 100;
    }
    return taxes;
  };
  // console.log(cart.cartItems[0]);

  if (cart) {
    const cardData = {
      ...cart.toObject({ getters: true }),
      // restaurantData: cart.restaurant,
      totalPrice: 0,
      totalTaxes: 0,
      grandTotalPrice: 0,
      grandTotalTaxes: 0,
      packagingCharge: 0,
      discount: 0,
      deliveryCharge: 0,
      paymentAmount: 0,
    };
    for (let index = 0; index < cardData.cartItems.length; index++) {
      const element = cardData.cartItems[index];
      let subTotalPrice =
        Number(element.item.price) * cardData.cartItems[index].quantity;
      // cardData.packagingCharge =
      //   cardData.packagingCharge +
      //   element.item.ybitesPackingCharges * cardData.cartItems[index].quantity;

      let subTotalTax = await calculateTax(
        cardData.cartItems[index].item.item_tax,
        Number(cardData.cartItems[index].item.price),
        cardData.cartItems[index].quantity
      );
      const attribute = await Attributes.findOne({
        attributeid: element.item.item_attributeid,
      });
      for (let p = 0; p < element.item.addon.length; p++) {
        // console.log(p);
        const addonElement = element.item.addon[p];
        const addonGroupData = await Addongroups.findOne({
          addongroupid: addonElement.addon_group_id,
        });
        element.item.addon[p].addonGroup = addonGroupData;
        // console.log(addonElement);
      }
      for (let r = 0; r < element.item.variation.length; r++) {
        const variationItemElement = element.item.variation[r].addon;
        for (let s = 0; s < variationItemElement.length; s++) {
          const variationItemAddonElement = variationItemElement[s];

          const addonGroupData = await Addongroups.findOne({
            addongroupid: variationItemAddonElement.addon_group_id,
          });
          variationItemAddonElement.addonGroup = addonGroupData;
        }
        // console.log(addonElement);
      }

      let variation = null;
      const addons = [];
      cardData.cartItems[index].item.item_attribute = attribute;

      if (element.variation) {
        console.log("addonGroupFind");
        for (
          let k = 0;
          k < cardData.cartItems[index].item.variation.length;
          k++
        ) {
          const itemVariationElement =
            cardData.cartItems[index].item.variation[k];

          // console.log(itemVariationElement.addon);
          for (let l = 0; l < itemVariationElement.addon.length; l++) {
            const variationAddonElement = itemVariationElement.addon[l];
            const addonGroupFind = await Addongroups.findOne({
              addongroupid: variationAddonElement.addon_group_id,
            });
            variationAddonElement.addonGroup = addonGroupFind;
          }

          if (itemVariationElement._id.equals(element.variation)) {
            variation = itemVariationElement;
            subTotalPrice =
              Number(itemVariationElement.price) *
                cardData.cartItems[index].quantity +
              subTotalPrice;

            subTotalTax = await calculateTaxForExtra(
              cardData.cartItems[index].item.item_tax,
              Number(itemVariationElement.price),
              cardData.cartItems[index].quantity,
              subTotalTax
            );
          }
        }
      }

      for (let j = 0; j < element.addons.length; j++) {
        const addonId = element.addons[j];
        const addonGroup = await Addongroups.findOne({
          addongroupitems: {
            $elemMatch: {
              _id: mongoose.Types.ObjectId(addonId),
              default: true,
            },
          },
        });
        // console.log(addonGroup);
        const addonGroupWithSingleItem = addonGroup?.toObject({
          getters: true,
        });
        const addOnItem = [];
        for (let m = 0; m < addonGroup.addongroupitems.length; m++) {
          const addonGroupItemElement = addonGroup.addongroupitems[m];
          // console.log(addonGroupItemElement);
          if (addonGroupItemElement._id.equals(addonId)) {
            addonGroupWithSingleItem.addongroupitems = addonGroupItemElement;
            addOnItem.push(addonGroupItemElement);
            subTotalPrice =
              Number(addonGroupItemElement.addonitem_price) *
                cardData.cartItems[index].quantity +
              subTotalPrice;

            subTotalTax = await calculateTaxForExtra(
              cardData.cartItems[index].item.item_tax,
              Number(addonGroupItemElement.addonitem_price),
              cardData.cartItems[index].quantity,
              subTotalTax
            );
          }
        }
        addons.push(addonGroupWithSingleItem.addongroupitems);
      }

      cardData.cartItems[index].variation = variation;
      cardData.cartItems[index].addons = addons;
      cardData.cartItems[index].subTotalPrice = subTotalPrice;
      cardData.cartItems[index].subTotalTax = subTotalTax;
      cardData.totalPrice = subTotalPrice + cardData.totalPrice;
      cardData.totalTaxes = subTotalTax.taxPrice + cardData.totalTaxes;
    }

    //cardData.packagingCharge
    if (cardData.totalPrice <= 100) {
      cardData.packagingCharge = 10;
    } else if (cardData.totalPrice <= 200) {
      cardData.packagingCharge = 20;
    } else if (cardData.totalPrice <= 300) {
      cardData.packagingCharge = 30;
    } else {
      cardData.packagingCharge = 30;
    }

    // if (cardData.totalPrice <= 100) {
    //   cardData.packagingCharge = 10;
    // } else if (cardData.totalPrice <= 200) {
    //   cardData.packagingCharge = 20;
    // } else if (cardData.totalPrice <= 300) {
    //   cardData.packagingCharge = 30;
    // } else {
    //   cardData.packagingCharge = 30;
    // }

    if (cart.restaurant) {
      const calculateDeliveryCharge = async () => {
        let distance;

        const restaurantData = await Restaurant.findById(cart.restaurant);
        const address = await Address.findById(addressId);
        const data = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${restaurantData.location.coordinates[0]}%2C${restaurantData.location.coordinates[1]}%3B${address.location.coordinates[0]}%2C${address.location.coordinates[1]}?alternatives=true&annotations=duration%2Cdistance&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
        );
        console.log("Mapbox Directions API Response:", data.data);

        console.log(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${restaurantData.location.coordinates[0]}%2C${restaurantData.location.coordinates[1]}%3B${address.location.coordinates[0]}%2C${address.location.coordinates[1]}?alternatives=true&annotations=duration%2Cdistance&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
        );
        // distance = data.data.routes[0].distance;
        // Handle the response data as needed
        const routes = data.data.routes;
        if (Array.isArray(routes) && routes.length > 0) {
          const route = routes[0];
          distance = route.distance;
          const duration = route.duration;
          console.log("Distance:", distance, "meters");
          console.log("Duration:", duration, "seconds");
        }
        if (distance <= 500) {
          console.log(distance);
          return 35;
        } else if (distance <= 1000) {
          return 40;
        } else if (distance <= 2000) {
          return 45;
        } else if (distance <= 3000) {
          return 50;
        } else if (distance <= 4000) {
          return 55;
        } else if (distance <= 5000) {
          return 60;
        } else if (distance <= 6000) {
          return 65;
        } else if (distance <= 7000) {
          return 70;
        } else if (distance <= 8000) {
          return 75;
        } else if (distance <= 9000) {
          return 80;
        } else if (distance <= 10000) {
          return 85;
        } else {
          return 105;
        }
      };
      if (addressId) {
        cardData.deliveryCharge = await calculateDeliveryCharge();
      }
      cardData.grandTotalPrice = cardData.totalPrice;
      cardData.grandTotalTaxes = cardData.totalTaxes;

      // check and verify coupon
      console.log(cardData.coupon);
      if (cardData.coupon) {
        // console.log(true);

        const orderCount = await Order.count({ customer: req.customer._id });
        // const cardData = await Cart.findOne({ customer: req.customer._id });

        if (cardData.coupon.newCustomer) {
          if (!(cardData.coupon.totalCount > orderCount)) {
            console.log(cardData.coupon);

            cart.coupon = undefined;
            console.log("Cupon removed");
            await cart.save();
            cardData.coupon = undefined;
            console.log("Cupon removed");
          }
        }

        const orderCountData = await Order.count({
          customer: req.customer._id,
          coupon: cardData.coupon._id,
        });
        if (cardData.coupon.totalCount < orderCountData) {
          console.log(cardData.coupon.totalCount);
          cart.coupon = undefined;
          await cart.save();
          cardData.coupon = undefined;
          console.log("Cupon removed");
        }
        // if (cardData.coupon.couponType === "restaurant") {
        //   if (!cardData.restaurant.equals(cart.restaurant))
        //     cart.coupon = undefined;
        //   await cart.save();
        //   cardData.coupon = undefined;
        //   console.log("Cupon removed");
        // }
        if (!cardData.coupon) {
          cart.coupon = undefined;
          await cart.save();
          cardData.coupon = undefined;
          console.log("Cupon removed");
        }
        if (cardData.coupon.expire < new Date()) {
          cart.coupon = undefined;
          await cart.save();
          cardData.coupon = undefined;
          console.log("Cupon removed");
        }
        if (cardData.coupon && cardData.totalPrice > cardData.coupon.minValue) {
          cart.coupon = cardData.coupon._id;
          await cart.save();
        } else {
          cart.coupon = undefined;
          await cart.save();
          cardData.coupon = undefined;
          console.log("Cupon removed");
        }

        if (cardData.coupon && !cardData.coupon.freeDelivery) {
          let couponDiscountPercent = cardData.coupon.percentage;
          let grandTotalPrice = 0;
          let grandTotalTaxes = 0;
          let discount = 0;

          if (
            (cardData.totalPrice * cardData.coupon.percentage) / 100 >
            cardData.coupon.maxDiscount
          ) {
            couponDiscountPercent =
              (cardData.coupon.maxDiscount / cardData.totalPrice) * 100;
          }
          // console.log(couponDiscountPercent);

          for (let index = 0; index < cardData.cartItems.length; index++) {
            const cartItemElement = cardData.cartItems[index];
            const oldPrice = cartItemElement.subTotalPrice;
            cartItemElement.subTotalPrice =
              cartItemElement.subTotalPrice -
              (cartItemElement.subTotalPrice * couponDiscountPercent) / 100;
            let subTotalTax = await calculateTax(
              cartItemElement.item.item_tax,
              cartItemElement.subTotalPrice,
              1
            );
            // console.log(cartItemElement.subTotalPrice);
            cartItemElement.subTotalTax = subTotalTax;
            discount = discount + (oldPrice - cartItemElement.subTotalPrice);
            grandTotalPrice = grandTotalPrice + cartItemElement.subTotalPrice;
            grandTotalTaxes =
              grandTotalTaxes + cartItemElement.subTotalTax.taxPrice;
          }
          cardData.grandTotalPrice = grandTotalPrice;
          cardData.grandTotalTaxes = grandTotalTaxes;
          cardData.discount = discount;
          cardData.grandTotalPrice = grandTotalPrice;
        } else if (cardData.coupon && cardData.coupon.freeDelivery) {
          cardData.discount = cardData.deliveryCharge;
          cardData.deliveryCharge = 0;
        }
        // console.log(cardData);
      }
      cardData.paymentAmount =
        cardData.grandTotalPrice +
        cardData.grandTotalTaxes +
        cardData.packagingCharge +
        cardData.deliveryCharge +
        cart.deliveryTip;

      res.status(200).json({
        status: "success",
        message: "successful",
        data: cardData,
        // taxes,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "successful",
        data: cart,
      });
    }
  } else {
    const data = await Cart.create({ customer: req.customer._id });

    res.status(200).json({
      status: "success",
      message: "successful",
      data,
    });
  }
});

exports.addCouponToCart = catchAsync(async (req, res, next) => {
  const { addressId, deliveryTip, couponCode } = req.body;
  const cart = await Cart.findOne({
    customer: req.customer._id,
  })
    .populate({ path: "cartItems", populate: "item" })
    .populate({
      path: "restaurant",
      select: "outlet_name restaurant_logo",
    });

  if (deliveryTip) {
    cart.deliveryTip = deliveryTip;
    await cart.save();
  }
  const calculateTax = async (taxString, price, quantity) => {
    const taxesArray = taxString.split(",");
    let taxes = { taxPrice: 0 };
    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      taxes[tax.taxname] = (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.taxPrice =
        taxes.taxPrice + (Number(tax.tax) * (Number(price) * quantity)) / 100;
    }
    return taxes;
  };

  const calculateTaxForExtra = async (taxString, price, quantity, taxes) => {
    const taxesArray = taxString.split(",");

    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      taxes[tax.taxname] =
        taxes[tax.taxname] +
        (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.taxPrice =
        taxes.taxPrice + (Number(tax.tax) * (Number(price) * quantity)) / 100;
    }
    return taxes;
  };
  // console.log(cart.cartItems[0]);

  if (cart) {
    const cardData = {
      ...cart.toObject({ getters: true }),
      // restaurantData: cart.restaurant,
      totalPrice: 0,
      totalTaxes: 0,
      grandTotalPrice: 0,
      grandTotalTaxes: 0,
      packagingCharge: 0,
      discount: 0,
      deliveryCharge: 0,
      paymentAmount: 0,
    };
    for (let index = 0; index < cardData.cartItems.length; index++) {
      const element = cardData.cartItems[index];
      let subTotalPrice =
        Number(element.item.price) * cardData.cartItems[index].quantity;
      // cardData.packagingCharge =
      //   cardData.packagingCharge +
      //   element.item.ybitesPackingCharges * cardData.cartItems[index].quantity;

      let subTotalTax = await calculateTax(
        cardData.cartItems[index].item.item_tax,
        Number(cardData.cartItems[index].item.price),
        cardData.cartItems[index].quantity
      );
      const attribute = await Attributes.findOne({
        attributeid: element.item.item_attributeid,
      });
      for (let p = 0; p < element.item.addon.length; p++) {
        // console.log(p);
        const addonElement = element.item.addon[p];
        const addonGroupData = await Addongroups.findOne({
          addongroupid: addonElement.addon_group_id,
        });
        element.item.addon[p].addonGroup = addonGroupData;
        // console.log(addonElement);
      }
      for (let r = 0; r < element.item.variation.length; r++) {
        const variationItemElement = element.item.variation[r].addon;
        for (let s = 0; s < variationItemElement.length; s++) {
          const variationItemAddonElement = variationItemElement[s];

          const addonGroupData = await Addongroups.findOne({
            addongroupid: variationItemAddonElement.addon_group_id,
          });
          variationItemAddonElement.addonGroup = addonGroupData;
        }
        // console.log(addonElement);
      }

      let variation = null;
      const addons = [];
      cardData.cartItems[index].item.item_attribute = attribute;

      if (element.variation) {
        console.log("addonGroupFind");
        for (
          let k = 0;
          k < cardData.cartItems[index].item.variation.length;
          k++
        ) {
          const itemVariationElement =
            cardData.cartItems[index].item.variation[k];

          // console.log(itemVariationElement.addon);
          for (let l = 0; l < itemVariationElement.addon.length; l++) {
            const variationAddonElement = itemVariationElement.addon[l];
            const addonGroupFind = await Addongroups.findOne({
              addongroupid: variationAddonElement.addon_group_id,
            });
            variationAddonElement.addonGroup = addonGroupFind;
          }

          if (itemVariationElement._id.equals(element.variation)) {
            variation = itemVariationElement;
            subTotalPrice =
              Number(itemVariationElement.price) *
                cardData.cartItems[index].quantity +
              subTotalPrice;

            subTotalTax = await calculateTaxForExtra(
              cardData.cartItems[index].item.item_tax,
              Number(itemVariationElement.price),
              cardData.cartItems[index].quantity,
              subTotalTax
            );
          }
        }
      }

      for (let j = 0; j < element.addons.length; j++) {
        const addonId = element.addons[j];
        const addonGroup = await Addongroups.findOne({
          addongroupitems: {
            $elemMatch: {
              _id: mongoose.Types.ObjectId(addonId),
              default: true,
            },
          },
        });
        // console.log(addonGroup);
        const addonGroupWithSingleItem = addonGroup?.toObject({
          getters: true,
        });
        const addOnItem = [];
        for (let m = 0; m < addonGroup.addongroupitems.length; m++) {
          const addonGroupItemElement = addonGroup.addongroupitems[m];
          // console.log(addonGroupItemElement);
          if (addonGroupItemElement._id.equals(addonId)) {
            addonGroupWithSingleItem.addongroupitems = addonGroupItemElement;
            addOnItem.push(addonGroupItemElement);
            subTotalPrice =
              Number(addonGroupItemElement.addonitem_price) *
                cardData.cartItems[index].quantity +
              subTotalPrice;

            subTotalTax = await calculateTaxForExtra(
              cardData.cartItems[index].item.item_tax,
              Number(addonGroupItemElement.addonitem_price),
              cardData.cartItems[index].quantity,
              subTotalTax
            );
          }
        }
        addons.push(addonGroupWithSingleItem.addongroupitems);
      }

      cardData.cartItems[index].variation = variation;
      cardData.cartItems[index].addons = addons;
      cardData.cartItems[index].subTotalPrice = subTotalPrice;
      cardData.cartItems[index].subTotalTax = subTotalTax;
      cardData.totalPrice = subTotalPrice + cardData.totalPrice;
      cardData.totalTaxes = subTotalTax.taxPrice + cardData.totalTaxes;
    }
    //cardData.packagingCharge
    if (cardData.totalPrice <= 100) {
      cardData.packagingCharge = 10;
    } else if (cardData.totalPrice <= 200) {
      cardData.packagingCharge = 20;
    } else if (cardData.totalPrice <= 300) {
      cardData.packagingCharge = 30;
    }
    // console.log("cart => ", cart);

    // apply cupon
    // apply cupon
    // coupon work
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return next(new AppError("Invalid Coupon", 404));
    }
    const orderCount = await Order.count({ customer: req.customer._id });
    if (coupon.newCustomer) {
      if (!(coupon.totalCount > orderCount)) {
        return next(new AppError("You are not a new user", 404));
      }
    }
    const orderCountData = await Order.count({
      customer: req.customer._id,
      coupon: coupon._id,
    });
    if (coupon.totalCount < orderCountData) {
      return next(
        new AppError("This coupon is not applicable for the order", 404)
      );
    }
    // if (coupon.couponType === "restaurant") {
    //   if (!coupon.restaurant.equals(cart.restaurant))
    //     return next(
    //       new AppError("This coupon is not for this restaurant", 404)
    //     );
    // }
    if (coupon.couponType === "restaurant") {
      if (!coupon.restaurant.equals(cart.restaurant._id)) {
        return next(
          new AppError("This coupon is not for the selected restaurant", 404)
        );
      }
    }
    if (coupon.expire < new Date()) {
      return next(new AppError("Coupon Expire", 404));
    }
    // const cardData = await Cart.findOne({ customer: req.customer._id });
    if (Number(cardData.totalPrice) > coupon.minValue) {
      // console.log(cardData.totalPrice, coupon.minValue);
      cart.coupon = coupon._id;
      await cart.save();
    } else {
      return next(
        new AppError(`Min value for order is ${coupon.minValue}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "Coupon applied successful",
    });
  } else {
    const data = await Cart.create({ customer: req.customer._id });

    res.status(200).json({
      status: "success",
      message: "successful",
      data,
    });
  }
});

exports.getCouponCheck = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find({
    expire: { $gt: new Date() },
    visible: true,
  });
  res.status(200).json({
    status: "success",
    message: "Coupon created successfully",
    data: coupons,
  });
});
// exports.getCouponCheck = catchAsync(async (req, res, next) => {
//   let query = {
//     expire: { $gt: new Date() },
//     visible: true,
//   };

//   // Check if couponType is provided
//   if (!req.query.couponType) {
//     return res.status(400).json({
//       status: "error",
//       message: "Please provide a couponType parameter.",
//     });
//   }

//   if (req.query.couponType === "admin") {
//     // If couponType is admin, get all admin coupons
//     query.couponType = "admin";
//   } else if (req.query.couponType === "restaurant") {
//     // If couponType is restaurant, get coupons by restaurant ID
//     if (!req.query.restaurantId) {
//       return res.status(400).json({
//         status: "error",
//         message:
//           "Please provide a restaurantId parameter for restaurant coupons.",
//       });
//     }
//     query.couponType = "restaurant";
//     query.restaurant = req.query.restaurantId;
//   } else {
//     // Invalid couponType provided
//     return res.status(400).json({
//       status: "error",
//       message:
//         "Invalid coupon type. Supported types are 'admin' and 'restaurant'.",
//     });
//   }

//   const coupons = await Coupon.find(query);

//   res.status(200).json({
//     status: "success",
//     message: "Coupons retrieved successfully",
//     data: coupons,
//   });
// });
// exports.getCoupon = catchAsync(async (req, res, next) => {
//   let query = {
//     expire: { $gt: new Date() },
//     visible: true,
//   };

//   // Allow couponType to be an array of values
//   const couponTypes = Array.isArray(req.query.couponType)
//     ? req.query.couponType
//     : [req.query.couponType];

//   // Initialize objects to store admin and restaurant data
//   let responseData = {
//     admin: [],
//     restaurant: [],
//   };

//   // If couponTypes  admin, get all admin coupons
//   if (couponTypes.includes("admin")) {
//     const adminCoupons = await Coupon.find({ ...query, couponType: "admin" });
//     responseData.admin = adminCoupons;
//   }

//   // If couponTypes  restaurant, get coupons by restaurant ID
//   if (couponTypes.includes("restaurant")) {
//     if (!req.query.restaurantId) {
//       return res.status(400).json({
//         status: "error",
//         message:
//           "Please provide a restaurantId parameter for restaurant coupons.",
//       });
//     }
//     const restaurantCoupons = await Coupon.find({
//       ...query,
//       couponType: "restaurant",
//       restaurant: req.query.restaurantId,
//     });
//     responseData.restaurant = restaurantCoupons;
//   }

//   res.status(200).json({
//     status: "success",
//     message: "Coupons retrieved successfully",
//     data: responseData,
//   });
// });
// exports.getCoupon = catchAsync(async (req, res, next) => {
//   const allCoupons = await Coupon.find({
//     expire: { $gt: new Date() },
//     visible: true,
//   });

//   const adminCoupons = allCoupons.filter(
//     (coupon) => coupon.couponType === "admin"
//   );
//   const restaurantCoupons = req.query.restaurantId
//     ? allCoupons.filter(
//         (coupon) =>
//           coupon.couponType === "restaurant" &&
//           coupon.restaurant == req.query.restaurantId
//       )
//     : [];

//   res.status(200).json({
//     status: "success",
//     message: "Coupons retrieved successfully",
//     data: {
//       admin: adminCoupons,
//       restaurant: restaurantCoupons,
//     },
//   });
// });
exports.getCoupon = catchAsync(async (req, res, next) => {
  const allCoupons = await Coupon.find({
    expire: { $gt: new Date() },
    visible: true,
  });

  const adminCoupons = allCoupons.filter(
    (coupon) => coupon.couponType === "admin"
  );

  const restaurantCoupons = req.query.restaurantId
    ? allCoupons.filter(
        (coupon) =>
          coupon.couponType === "restaurant" &&
          coupon.restaurant == req.query.restaurantId
      )
    : [];

  const coupons = adminCoupons.concat(restaurantCoupons);

  res.status(200).json({
    status: "success",
    message: "Coupons retrieved successfully",
    coupons: coupons,
  });
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  const cardData = await Cart.findOne({ customer: req.customer._id });
  cardData.coupon = undefined;
  await cardData.save();
  res.status(200).json({ status: "success", message: "deleted successfully" });
});
