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
const AppError = require("../../utils/appError");
const PreOrder = require("../../models/order/preOrderModel");
const OrderItem = require("../../models/order/orderItem");
const Payment = require("../../models/payment/paymentModel");
const nodeCCAvenue = require("node-ccavenue");
const Order = require("../../models/order/orderModel");
const OrderComplain = require("../../models/order/orderComplainModel");
const moment = require("moment/moment");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: "2458258",
  working_key: "1B37D190A491F09977034103A7EE60BD",
});
function areTimesWithin2MinutesDifference(time1, time2) {
  const diffInMilliseconds = Math.abs(time1 - time2);
  const twoMinutesInMilliseconds = 2 * 60 * 1000; // 2 minutes in milliseconds

  return diffInMilliseconds <= twoMinutesInMilliseconds;
}
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;

  const order = await Order.findById(orderId);
  const time1 = new Date(order.createdAt);
  const time2 = new Date();

  if (order.paymentMode === "COD") {
    if (areTimesWithin2MinutesDifference(time1, time2)) {
      order.status = "Cancelled";
      await order.save();
      res
        .status(200)
        .json({ status: "success", message: "Order cancelled successfully " });
    } else {
      return next(new AppError("Time is more than 2 mins ", 400));
    }
  } else {
    return next(new AppError("This order is paid online ", 400));
  }
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { addressId, paymentMode, note } = req.body;
  const address = await Address.findById(addressId);
  if (!address) {
    return next(new AppError("Invalid address.", 404));
  }

  const cart = await Cart.findOne({
    customer: req.customer._id,
  })
    .populate({ path: "cartItems", populate: "item" })
    .populate({ path: "coupon" })
    .populate({
      path: "restaurant",
      select: "outlet_name restaurant_logo",
    });
  if (!cart.restaurant) {
    return next(new AppError("cart empty.", 404));
  }
  const restaurantData = await Restaurant.findById(cart.restaurant).populate(
    "taxes"
  );

  const calculateTax = async (taxString, price, quantity) => {
    const taxesArray = taxString.split(",");
    let taxes = { taxPrice: 0 };
    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      taxes[tax.taxname] = (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.taxPrice =
        taxes.taxPrice + (Number(tax.tax) * (Number(price) * quantity)) / 100;
      taxes.id = tax.taxid;
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

  //
  const petPoojaTax = [];
  const calculateTaxForPetPooja = async (
    taxString,
    cartItemElement,
    quantity
  ) => {
    const taxesArray = taxString.split(",");
    const data = [];
    let price =
      Number(cartItemElement.item.price) +
      (cartItemElement.variation ? Number(cartItemElement.variation.price) : 0);
    console.log(price);
    for (let index = 0; index < cartItemElement.addons.length; index++) {
      const addonElement = cartItemElement.addons[index];
      price = price + Number(addonElement.addonitem_price);
    }
    console.log(price);

    for (let j = 0; j < taxesArray.length; j++) {
      const tax = await Taxes.findOne({ taxid: taxesArray[j] });
      data.push({
        taxid: tax.taxid,
        name: tax.taxname,
        amount: `${(Number(tax.tax) * (Number(price) * quantity)) / 100}`,
      });
      const found = petPoojaTax.findIndex(
        (element) => element.id === tax.taxid
      );
      if (found === -1) {
        petPoojaTax.push({
          id: tax.taxid,
          title: tax.taxname,
          type: "P",
          price: tax.tax,
          tax: `${(Number(tax.tax) * (Number(price) * quantity)) / 100}`,
          restaurant_liable_amt: `${
            (Number(tax.tax) * (Number(price) * quantity)) / 100
          }`,
        });
      } else {
        petPoojaTax[found] = {
          id: tax.taxid,
          title: tax.taxname,
          type: "P",
          price: tax.tax,
          tax: `${
            (Number(tax.tax) * (Number(price) * quantity)) / 100 +
            petPoojaTax[found].tax
          }`,
          restaurant_liable_amt: `${
            (Number(tax.tax) * (Number(price) * quantity)) / 100 +
            petPoojaTax[found].restaurant_liable_amt
          }`,
        };
      }
    }
    return data;
  };
  const calculateDeliveryCharge = async (condition) => {
    const data = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${restaurantData.location.coordinates[0]}%2C${restaurantData.location.coordinates[1]}%3B${address.location.coordinates[0]}%2C${address.location.coordinates[1]}?alternatives=true&annotations=duration%2Cdistance&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.ACCESS_TOKEN_MAPBOX}`
    );
    const distance = data.data.routes[0].distance;
    if (condition) {
      return distance;
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
      return 115;
    }
  };
  console.log(await calculateDeliveryCharge(true));
  if ((await calculateDeliveryCharge(true)) > 1000 * 5) {
    return next(new AppError("Cannot Order", 404));
  }

  if (cart) {
    const cardData = {
      ...cart.toObject({ getters: true }),
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
      cardData.cartItems[index].subPrice = subTotalPrice;
      cardData.cartItems[index].subTotalTax = subTotalTax;
      cardData.cartItems[index].subTax = subTotalTax;
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

    cardData.deliveryCharge = await calculateDeliveryCharge();
    const deliveryBoyShare = cardData.deliveryCharge;

    cardData.grandTotalPrice = cardData.totalPrice;
    cardData.grandTotalTaxes = cardData.totalTaxes;

    // check and verify coupon
    console.log(cardData.coupon);
    if (cardData.coupon) {
      // console.log(true);

      const orderCount = Order.count({ customer: req.customer._id });
      // const cardData = await Cart.findOne({ customer: req.customer._id });

      // if (cardData.coupon.newCustomer) {
      //   if (!(cardData.coupon.totalCount > orderCount)) {
      //     console.log(cardData.coupon);

      //     cart.coupon = undefined;
      //     console.log("Cupon removed newCustomer");
      //     await cart.save();
      //     cardData.coupon = undefined;
      //     console.log("Cupon removed newCustomer");
      //   }
      // }

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

    //   return next(new AppError("You are above 10Km from restaurant.", 404));

    // Start Pre-Order
    const orderCount = await PreOrder.count();
    const preOrder = await PreOrder.create({
      customer: req.customer._id,
      orderId: orderCount + 1000000,
      deliveryTip: cart.deliveryTip,

      restaurant: cardData.restaurant,
      customerAddress: address._id,
      paymentMode: paymentMode,
      totalPrice: cardData.totalPrice,
      totalTaxes: cardData.totalTaxes,
      grandTotalPrice: cardData.grandTotalPrice,
      deliveryBoyShare,
      grandTotalTaxes: cardData.grandTotalTaxes,
      packagingCharge: cardData.packagingCharge,
      discount: cardData.discount,
      deliveryCharge: cardData.deliveryCharge,
      paymentAmount: cardData.paymentAmount,
      note: note,
    });

    // order item create
    for (let j = 0; j < cardData.cartItems.length; j++) {
      const cardItemElement = cardData.cartItems[j];
      const orderItem = await OrderItem.create({
        item: cardItemElement.item._id,
        itemTitle: cardItemElement.item.itemname,
        addOnIds: cardItemElement.addons.map((a) => {
          return a._id;
        }),
        addOnsTitles: cardItemElement.addons.map((a) => {
          return a.addonitem_name;
        }),
        variation: cardItemElement.variation?._id,
        variationTitle: cardItemElement.variation?.name,
        price: cardItemElement.subPrice,
        tax: cardItemElement.subTax.taxPrice,
        couponDiscountPrice: 0,
        quantity: cardItemElement.quantity,
        totalPrice: cardItemElement.subTotalPrice,
        totalTax: cardItemElement.subTotalTax.taxPrice,
      });
      preOrder.orderItems.push(orderItem._id);
    }
    await preOrder.save();
    // Pre-Order Complete
    // payment start

    if (paymentMode === "kotak") {
      const getPetpoojaAddOnItem = async (cartItemElement) => {
        // console.log(cartItemElement);

        const addons = [];
        for (let index = 0; index < cartItemElement.addons.length; index++) {
          const addonElement = cartItemElement.addons[index];
          const addonGroup = await Addongroups.findOne({
            addongroupitems: {
              $elemMatch: {
                _id: mongoose.Types.ObjectId(addonElement._id),
                default: true,
              },
            },
          });
          addons.push({
            id: addonElement.addonitemid,
            name: addonElement.addonitem_name,
            group_name: addonGroup.addongroup_name,
            price: addonElement.addonitem_price,
            group_id: addonGroup.addongroupid,
            quantity: `${cartItemElement.quantity}`,
          });
        }
        return addons;
      };
      if (restaurantData.petPooja) {
        const petPoojaOrderItem = async (cartItems) => {
          const itemData = [];
          for (let index = 0; index < cartItems.length; index++) {
            const cartItemElement = cartItems[index];
            const data = {
              id: cartItemElement.item.itemid,
              name: cartItemElement.item.itemname,
              gst_liability: "restaurant",
              item_tax: await calculateTaxForPetPooja(
                cartItemElement.item.item_tax,
                cartItemElement,
                cartItemElement.quantity
              ),

              item_discount: `${
                cartItemElement.subPrice - cartItemElement.subTotalPrice
              }`,
              price: `${cartItemElement.subPrice}`,
              final_price: `${cartItemElement.subTotalPrice}`,
              quantity: `${cartItemElement.quantity}`,
              description: "",
              variation_name: cartItemElement.variation
                ? cartItemElement.variation.name
                : "",
              variation_id: cartItemElement.variation
                ? cartItemElement.variation.variationid
                : "",
              AddonItem: {
                details: await getPetpoojaAddOnItem(cartItemElement),
              },
            };
            itemData.push(data);
          }
          return itemData;
        };
        const petPoojaData = {
          app_key: process.env.PETPOOJA_APP_KEY,
          app_secret: process.env.PETPOOJA_APP_SECRET,
          access_token: process.env.PETPOOJA_ACCESS_TOKEN,
          orderinfo: {
            OrderInfo: {
              Restaurant: {
                details: {
                  res_name: restaurantData.outlet_name,
                  address: restaurantData.address,
                  contact_information: restaurantData.business_contact,
                  restID: restaurantData.outlet_id,
                },
              },
              Customer: {
                details: {
                  email: req.customer.email,
                  name: req.customer.name,
                  address: address.completeAddress,
                  phone: req.customer.phone.split("+91")[1],
                  latitude: address.location.coordinates[1].toString(),
                  longitude: address.location.coordinates[0].toString(),
                },
              },
              Order: {
                details: {
                  orderID: preOrder.orderId.toString(),
                  preorder_date: moment(preOrder.createdAt).format(
                    "YYYY-MM-DD"
                  ),
                  preorder_time: moment(preOrder.createdAt).format("hh:mm:ss"),
                  service_charge: "",
                  sc_tax_amount: "",
                  delivery_charges: "",
                  packing_charges: "",
                  order_type: "H",
                  ondc_bap: "",
                  advanced_order: "N",
                  payment_type: "Online",
                  table_no: "",
                  no_of_persons: "",
                  discount_total: `${
                    preOrder.deliveryBoyShare === preOrder.deliveryCharge
                      ? preOrder.discount
                      : ""
                  }`,
                  tax_total: `${preOrder.grandTotalTaxes}`,
                  discount_type: "F",
                  total: `${
                    preOrder.grandTotalPrice + preOrder.grandTotalTaxes
                  }`,
                  description: preOrder.note,
                  created_on: `${moment(preOrder.createdAt).format(
                    "YYYY-MM-DD"
                  )} ${moment(preOrder.createdAt).format("hh:mm:ss")}`,
                  enable_delivery: 1,
                  min_prep_time: 20,
                  // callback_url: `${process.env.CURRENT_URL}/api/v1.0.1/petPooja/order/update?orderId=${order._id}`,
                },
              },
              OrderItem: {
                details: await petPoojaOrderItem(cardData.cartItems),
              },
              Tax: {
                details: petPoojaTax,
              },
              // Discount: {
              //   details: [],
              // },
            },
            udid: "",
            device_type: "Web",
          },
        };
        console.log(`petPoojaData---:${petPoojaData}`);
        preOrder.petPoojaData = JSON.stringify(petPoojaData);
        await preOrder.save();

        console.log(`petPoojaData from preOrder:${preOrder.petPoojaData}`);

        // petpooja order created
        // const response = await axios.post(process.env.SAVEORDERURL, {
        //   ...petPoojaData,
        // });
        //
      }

      const payment = await Payment.create({
        amount: preOrder.paymentAmount,
        preOrder: preOrder._id,
        customer: req.customer._id,
        paymentMode: "kotak",
      });
      const orderParams = {
        order_id: preOrder.orderId,
        currency: "INR",
        amount: `${preOrder.paymentAmount}`,
        accessCode: "AVYG66KE01BH48GYHB",
        redirect_url: `${process.env.CURRENT_URL}/api/v1.0.1/customer/payment/confirm`,
        cancelUrl: `${process.env.CURRENT_URL}/api/v1.0.1/customer/payment/confirm`,
        billing_name: req.customer.name,
        billing_address: address.completeAddress,
        billing_city: address.city,
        billing_state: address.state,
        billing_zip: address.pinCode,
        billing_country: "India",
        billing_tel: req.customer.phone,
        billing_email: req.customer.email,
        merchant_param1: payment._id.toString(),
        merchant_param2: preOrder._id.toString(),
        merchant_param3: "kotak",
        // etc etc
      };

      preOrder.payment = payment._id;
      await preOrder.save();

      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);

      res
        .status(200)
        .json({ data: { ...orderParams, encVal: encryptedOrderData } });
    } else {
      const otp =
        `${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}` * 1;
      const order = await Order.create({
        customer: req.customer._id,
        orderId: preOrder.orderId,
        restaurant: preOrder.restaurant,
        customerAddress: address._id,
        paymentMode: paymentMode,
        otp,
        orderItems: preOrder.orderItems,
        deliveryTip: preOrder.deliveryTip,
        coupon: cart.coupon ? cart.coupon._id : null,
        totalPrice: preOrder.totalPrice,
        totalTaxes: preOrder.totalTaxes,
        grandTotalPrice: preOrder.grandTotalPrice,
        grandTotalTaxes: preOrder.grandTotalTaxes,
        packagingCharge: preOrder.packagingCharge,
        discount: preOrder.discount,
        deliveryCharge: preOrder.deliveryCharge,
        deliveryBoyShare: preOrder.deliveryBoyShare,
        paymentAmount: preOrder.paymentAmount,
        note: preOrder.note,
        paymentStatus: "COD",
      });
      const payment = await Payment.create({
        amount: preOrder.paymentAmount,
        order: order._id,
        paymentMode: paymentMode,
        paymentStatus: "COD",
        customer: req.customer._id,
      });

      const newCartItem = await Cart.findOne({
        customer: req.customer._id,
      });
      newCartItem.cartItems = [];
      newCartItem.deliveryTip = 0;
      newCartItem.coupon = undefined;
      newCartItem.restaurant = undefined;
      await newCartItem.save();

      order.payment = payment._id;
      // creating PetPooja order
      const getPetpoojaAddOnItem = async (cartItemElement) => {
        console.log(cartItemElement);

        const addons = [];
        for (let index = 0; index < cartItemElement.addons.length; index++) {
          const addonElement = cartItemElement.addons[index];
          const addonGroup = await Addongroups.findOne({
            addongroupitems: {
              $elemMatch: {
                _id: mongoose.Types.ObjectId(addonElement._id),
                default: true,
              },
            },
          });
          addons.push({
            id: addonElement.addonitemid,
            name: addonElement.addonitem_name,
            group_name: addonGroup.addongroup_name,
            price: addonElement.addonitem_price,
            group_id: addonGroup.addongroupid,
            quantity: `${cartItemElement.quantity}`,
          });
        }
        return addons;
      };
      if (restaurantData.petPooja) {
        const petPoojaOrderItem = async (cartItems) => {
          const itemData = [];
          for (let index = 0; index < cartItems.length; index++) {
            const cartItemElement = cartItems[index];
            const data = {
              id: cartItemElement.item.itemid,
              name: cartItemElement.item.itemname,
              gst_liability: "restaurant",
              item_tax: await calculateTaxForPetPooja(
                cartItemElement.item.item_tax,
                cartItemElement,
                cartItemElement.quantity
              ),

              item_discount: `${
                cartItemElement.subPrice - cartItemElement.subTotalPrice
              }`,
              price: `${cartItemElement.subPrice}`,
              final_price: `${cartItemElement.subTotalPrice}`,
              quantity: `${cartItemElement.quantity}`,
              description: "",
              variation_name: cartItemElement.variation
                ? cartItemElement.variation.name
                : "",
              variation_id: cartItemElement.variation
                ? cartItemElement.variation.variationid
                : "",
              AddonItem: {
                details: await getPetpoojaAddOnItem(cartItemElement),
              },
            };
            itemData.push(data);
          }
          return itemData;
        };
        const petPoojaData = {
          app_key: process.env.PETPOOJA_APP_KEY,
          app_secret: process.env.PETPOOJA_APP_SECRET,
          access_token: process.env.PETPOOJA_ACCESS_TOKEN,
          orderinfo: {
            OrderInfo: {
              Restaurant: {
                details: {
                  res_name: restaurantData.outlet_name,
                  address: restaurantData.address,
                  contact_information: restaurantData.business_contact,
                  restID: restaurantData.outlet_id,
                },
              },
              Customer: {
                details: {
                  email: req.customer.email,
                  name: req.customer.name,
                  address: address.completeAddress,
                  phone: req.customer.phone.split("+91")[1],
                  latitude: address.location.coordinates[1].toString(),
                  longitude: address.location.coordinates[0].toString(),
                },
              },
              Order: {
                details: {
                  orderID: order.orderId.toString(),
                  preorder_date: moment(order.createdAt).format("YYYY-MM-DD"),
                  preorder_time: moment(order.createdAt).format("hh:mm:ss"),
                  service_charge: "",
                  sc_tax_amount: "",
                  delivery_charges: "",
                  packing_charges: "",
                  order_type: "H",
                  ondc_bap: "",
                  advanced_order: "N",
                  payment_type: "COD",
                  table_no: "",
                  no_of_persons: "",
                  discount_total: `${
                    order.deliveryBoyShare === order.deliveryCharge
                      ? order.discount
                      : ""
                  }`,
                  tax_total: `${order.grandTotalTaxes}`,
                  discount_type: "F",
                  total: `${order.grandTotalPrice + order.grandTotalTaxes}`,
                  description: order.note,
                  created_on: `${moment(order.createdAt).format(
                    "YYYY-MM-DD"
                  )} ${moment(order.createdAt).format("hh:mm:ss")}`,
                  enable_delivery: 1,
                  min_prep_time: 20,
                  callback_url: `${process.env.CURRENT_URL}/api/v1.0.1/petPooja/order/update?orderId=${order._id}`,
                },
              },
              OrderItem: {
                details: await petPoojaOrderItem(cardData.cartItems),
              },
              Tax: {
                details: petPoojaTax,
              },
              // Discount: {
              //   details: [],
              // },
            },
            udid: "",
            device_type: "Web",
          },
        };
        order.petPoojaData = JSON.stringify(petPoojaData);
        await order.save();
        // petpooja order created
        // const response = await axios.post(process.env.SAVEORDERURL, {
        //   ...petPoojaData,
        // });
      }
      await order.save();
      console.log(`cart order data : ${order}`);
      res.status(200).json({
        data: { orderId: order._id },
        // petPoojaData,
        status: "success",
        message: "Order created with COD successfully",
      });
    }
  }
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    customer: req.customer._id,
    paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
  })
    .sort({
      _id: -1,
    })
    .populate({
      path: "orderItems",
      populate: { path: "item" },
    })
    .populate({ path: "customerAddress" })

    .populate({
      path: "restaurant",
      select:
        "outlet_name merchant_number address area pincode city business_contact state restaurant_logo",
    })
    .populate({ path: "deliveryPartner" })
    .populate({ path: "payment" })
    .populate({ path: "customerReviewByDeliveryPartner" })
    .populate({ path: "customerRestaurantReview" })
    .populate({ path: "orderReview" });

  // console.log(orders.length);
  const data = [];

  for (let index = 0; index < orders.length; index++) {
    const element = orders[index];
    const data2 = { ...element.toObject({ getters: true }) };
    // console.log(element.orderItems.length);
    for (let j = 0; j < data2.orderItems.length; j++) {
      const orderItemsElement = data2.orderItems[j];
      console.log(orderItemsElement.item.item_attributeid);
      const item_attribute = await Attributes.findOne({
        attributeid: orderItemsElement.item.item_attributeid,
      });
      orderItemsElement.item.item_attribute = item_attribute;
    }
    // data2.restaurant.id = undefined;
    data.push({ ...data2 });
    //item_attribute
  }
  return res
    .status(200)
    .json({ data: data, message: "successfully", status: "success" });
});
// exports.getMyOrders = catchAsync(async (req, res, next) => {
//   const orders = await Order.find({
//     customer: req.customer._id,
//     paymentStatus: ["Paid", "COD", "Refunded-In-Progress", "Refunded"],
//   })
//     .sort({
//       _id: -1,
//     })
//     .populate({
//       path: "orderItems",
//       populate: { path: "item" },
//     })
//     .populate({ path: "customerAddress" })
//     .populate({
//       path: "restaurant",
//       select:
//         "outlet_name merchant_number address area pincode city business_contact state restaurant_logo",
//     })
//     .populate({ path: "deliveryPartner" })
//     .populate({ path: "payment" })
//     .populate({ path: "customerReviewByDeliveryPartner" })
//     .populate({ path: "customerRestaurantReview" })
//     .populate({ path: "orderReview" });

//   const data = [];

//   for (let index = 0; index < orders.length; index++) {
//     const element = orders[index];
//     const data2 = { ...element.toObject({ getters: true }) };

//     for (let j = 0; j < data2.orderItems.length; j++) {
//       const orderItemsElement = data2.orderItems[j];

//       // Check if orderItemsElement.item is not null or undefined
//       if (orderItemsElement.item) {
//         const item_attribute = await Attributes.findOne({
//           attributeid: orderItemsElement.item.item_attributeid,
//         });

//         // Check if item_attribute is found before assigning
//         if (item_attribute) {
//           orderItemsElement.item.item_attribute = item_attribute;
//         }
//       }
//     }

//     data.push({ ...data2 });
//   }

//   return res
//     .status(200)
//     .json({ data: data, message: "successfully", status: "success" });
// });

exports.getSingleOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await Order.findById(orderId)

    .populate({
      path: "orderItems",
      populate: { path: "item" },
    })
    .populate({ path: "customerAddress" })

    .populate({
      path: "restaurant",
      select:
        "outlet_name merchant_number address area pincode city business_contact state restaurant_logo",
    })
    .populate({ path: "deliveryPartner" })
    .populate({ path: "payment" })
    .populate({ path: "customerReviewByDeliveryPartner" })
    .populate({ path: "customerRestaurantReview" })
    .populate({ path: "orderReview" });

  const data = { ...order.toObject({ getters: true }) };
  for (let j = 0; j < data.orderItems.length; j++) {
    const orderItemsElement = data.orderItems[j];
    console.log(orderItemsElement.item.item_attributeid);
    const item_attribute = await Attributes.findOne({
      attributeid: orderItemsElement.item.item_attributeid,
    });
    orderItemsElement.item.item_attribute = item_attribute;
  }

  //item_attribute
  // data.restaurant.id = undefined;

  return res
    .status(200)
    .json({ data: data, message: "successfully", status: "success" });
});

exports.getSingleOrderFromPaymentId = catchAsync(async (req, res, next) => {
  const { paymentId } = req.query;
  const payment = await Payment.findById(paymentId);
  const order = await Order.findById(payment.order)

    .populate({
      path: "orderItems",
      populate: { path: "item" },
    })
    .populate({ path: "customerAddress" })

    .populate({
      path: "restaurant",
      select:
        "outlet_name merchant_number address area pincode city business_contact state restaurant_logo",
    })
    .populate({ path: "deliveryPartner" })
    .populate({ path: "payment" })
    .populate({ path: "customerReviewByDeliveryPartner" })
    .populate({ path: "customerRestaurantReview" })
    .populate({ path: "orderReview" });

  const data = { ...order.toObject({ getters: true }) };
  for (let j = 0; j < data.orderItems.length; j++) {
    const orderItemsElement = data.orderItems[j];
    console.log(orderItemsElement.item.item_attributeid);
    const item_attribute = await Attributes.findOne({
      attributeid: orderItemsElement.item.item_attributeid,
    });
    orderItemsElement.item.item_attribute = item_attribute;
  }

  //item_attribute
  // data.restaurant.id = undefined;

  return res
    .status(200)
    .json({ data: data, message: "successfully", status: "success" });
});

exports.createOrderComplain = catchAsync(async (req, res, next) => {
  const { orderId, title, description } = req.body;
  const file = req.file;
  console.log(orderId, title, description);
  const order = await Order.findById(orderId);
  const count = await OrderComplain.count();
  const complain = await OrderComplain.create({
    customer: req.customer._id,
    order: order._id,
    complainNo: 100000 + count,
    restaurant: order.restaurant,
    customerTitle: title,
    customerDescription: description,
  });
  if (file) {
    const response = await uploadImg(file);
    complain.image = response.Key;
    await complain.save();
  }
  res.status(200).json({
    status: "success",
    message: "Complain created successfully",
    data: complain,
  });
});

exports.uploadImageOrderComplain = catchAsync(async (req, res, next) => {
  const complainId = req.query.complainId;
  const file = req.file;
  const response = await uploadImg(file);
  const complain = await OrderComplain.findById(complainId);
  complain.image = response.Key;
  await complain.save();
  res
    .status(200)
    .json({ status: "success", message: "Image added successfully" });
});

exports.getMyComplain = catchAsync(async (req, res, next) => {
  const complain = await OrderComplain.find({ customer: req.customer._id })
    .populate({
      path: "order",
      populate: {
        path: "orderItems",
        populate: { path: "menuItem", select: "title image menuItemType" },
      },
    })

    .populate({ path: "order", populate: { path: "customerAddress" } })
    .populate({ path: "order", populate: { path: "restaurantAddress" } })
    .populate({
      path: "order",
      populate: { path: "restaurant", select: "name phone images" },
    })
    .populate({ path: "order", populate: { path: "deliveryPartner" } })
    .populate({ path: "order", populate: { path: "payment" } });

  res
    .status(200)
    .json({ status: "success", message: "successfully", data: complain });
});

exports.verifyPayment = async (req, res) => {
  try {
    const { encResp } = req.body;
    const decryptedJsonResponse = ccav.redirectResponseToJson(encResp);
    // To check order_status: -
    console.log(decryptedJsonResponse);

    if (decryptedJsonResponse.order_status === "Success") {
      const payment = await Payment.findById(
        decryptedJsonResponse.merchant_param1
      );
      payment.status = "Paid";

      const preOrder = await PreOrder.findById(payment.preOrder).populate(
        "restaurant"
      );
      preOrder.paymentStatus = "Paid";
      await preOrder.save();
      const newCartItem = await Cart.findOne({
        customer: preOrder.customer,
      });
      newCartItem.cartItems = [];
      newCartItem.coupon = undefined;
      newCartItem.restaurant = undefined;
      await newCartItem.save();
      // order.paymentStatus = "Paid";
      // await order.save();

      const otp =
        `${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}` * 1;
      const order = await Order.create({
        customer: preOrder.customer,
        paymentStatus: "Paid",
        orderId: preOrder.orderId,
        restaurant: preOrder.restaurant,
        customerAddress: preOrder.customerAddress,
        paymentMode: preOrder.paymentMode,
        otp,
        orderItems: preOrder.orderItems,
        deliveryTip: preOrder.deliveryTip,
        coupon: preOrder.coupon ? preOrder.coupon : null,
        totalPrice: preOrder.totalPrice,
        totalTaxes: preOrder.totalTaxes,
        grandTotalPrice: preOrder.grandTotalPrice,
        grandTotalTaxes: preOrder.grandTotalTaxes,
        packagingCharge: preOrder.packagingCharge,
        discount: preOrder.discount,
        deliveryCharge: preOrder.deliveryCharge,
        deliveryBoyShare: preOrder.deliveryBoyShare,
        paymentAmount: preOrder.paymentAmount,
        note: preOrder.note,
        petPoojaData: preOrder.petPoojaData,

        payment: payment._id,
      });
      payment.order = order._id;
      const petPoojaData = JSON.parse(order.petPoojaData);
      petPoojaData.orderinfo.OrderInfo.Order.details.callback_url = `${process.env.CURRENT_URL}/api/v1.0.1/petPooja/order/update?orderId=${order._id}`;
      order.petPoojaData = JSON.stringify(petPoojaData);
      await order.save();
      await payment.save();
      res.status(200).json({
        status: decryptedJsonResponse.order_status,
      });
    } else {
      res.status(200).json({
        status: decryptedJsonResponse.order_status,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};
