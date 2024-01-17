const catchAsync = require("../../utils/catchAsync");
const Coupon = require("./../../models/offer/couponModal");
const { uploadImg } = require("../../config/s3config");

// Create a new coupon
exports.createCoupon = catchAsync(async (req, res, next) => {
  const {
    code,
    couponType,
    restaurant,
    freeDelivery,
    freeDeliveryApplyCount,
    applyCount,
    title,
    description,
    totalCount,
    expire,
    percentage,
    maxDiscount,
    newCustomer,
    minValue,
  } = req.body;
  let imageKey = null;
  if (req.file) {
    const file = req.file;
    const response = await uploadImg(file);
    imageKey = response.Key;
  }
  if (couponType === "admin") {
    if (freeDelivery) {
      const coupon = await Coupon.create({
        title,
        code,
        couponType,
        freeDelivery,
        description,
        expire: new Date(expire),
        freeDeliveryApplyCount,
        newCustomer,
        image: imageKey,
      });
      res.status(200).json({
        status: "success",
        message: "Coupon Created successfully",
        data: coupon,
      });
    } else {
      const coupon = await Coupon.create({
        title,
        code,
        couponType,
        description,
        expire: new Date(expire),
        newCustomer,
        code,
        freeDelivery,
        applyCount,
        totalCount,
        percentage,
        maxDiscount,
        minValue,
        image: imageKey,
      });
      res.status(200).json({
        status: "success",
        message: "Coupon Created successfully",
        data: coupon,
      });
    }
  } else {
    if (freeDelivery) {
      const coupon = await Coupon.create({
        title,
        code,
        couponType,
        freeDelivery,
        description,
        expire: new Date(expire),
        freeDeliveryApplyCount,
        newCustomer,
        restaurant,
        image: imageKey,
      });
      res.status(200).json({
        status: "success",
        message: "Coupon Created successfully",
        data: coupon,
      });
    } else {
      const coupon = await Coupon.create({
        title,
        code,
        couponType,
        description,
        expire: new Date(expire),
        newCustomer,
        code,
        freeDelivery,
        applyCount,
        totalCount,
        percentage,
        maxDiscount,
        minValue,
        restaurant,
        image: imageKey,
      });
      console.log(`coupondata :${coupon}`);
      res.status(200).json({
        status: "success",
        message: "Coupon Created successfully",
        data: coupon,
      });
    }
  }
});
// exports.createCoupon = catchAsync(async (req, res, next) => {
//   const {
//     code,
//     couponType,
//     restaurant,
//     freeDelivery,
//     freeDeliveryApplyCount,
//     applyCount,
//     title,
//     description,
//     totalCount,
//     expire,
//     percentage,
//     maxDiscount,
//     newCustomer,
//     minValue,
//   } = req.body;

//   // Check if an image file was uploaded
//   let imageKey = null;
//   if (req.file) {
//     const file = req.file;
//     const response = await uploadImg(file);
//     imageKey = response.Key;
//   }

//   // Handle creation of the coupon based on whether an image was uploaded
//   let couponData = {
//     title,
//     code,
//     couponType,
//     description,
//     expire: new Date(expire),
//     newCustomer,
//     image: imageKey,
//   };

//   if (couponType === "admin") {
//     if (freeDelivery) {
//       couponData = {
//         ...couponData,
//         freeDelivery,
//         freeDeliveryApplyCount,
//       };
//     } else {
//       couponData = {
//         ...couponData,
//         code,
//         freeDelivery,
//         applyCount,
//         totalCount,
//         percentage,
//         maxDiscount,
//         minValue,
//       };
//     }
//   } else {
//     couponData.restaurant = restaurant;

//     if (freeDelivery) {
//       couponData = {
//         ...couponData,
//         freeDelivery,
//         freeDeliveryApplyCount,
//       };
//     } else {
//       couponData = {
//         ...couponData,
//         code,
//         freeDelivery,
//         applyCount,
//         totalCount,
//         percentage,
//         maxDiscount,
//         minValue,
//       };
//     }
//   }

//   const coupon = await Coupon.create(couponData);

//   res.status(200).json({
//     status: "success",
//     message: "Coupon Created successfully",
//     data: coupon,
//   });
// });

// Edit active coupons

// exports.editCoupon = catchAsync(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const {
//       code,
//       couponType,
//       restaurant,
//       freeDelivery,
//       freeDeliveryApplyCount,
//       applyCount,
//       title,
//       description,
//       totalCount,
//       expire,
//       percentage,
//       maxDiscount,
//       newCustomer,
//       minValue,
//     } = req.body;
//     if (req.file) {
//       result.image = imageKey; // Set imageKey when an image is uploaded
//     } else {
//       // Set the image to an empty string if no image was provided
//       result.image = "";
//     }

//     const result = await Coupon.findById(id);
//     if (!result) {
//       return next(new AppError("Coupon not found"));
//     }

//     // Check the coupon type and handle creation accordingly
//     if (couponType === "admin") {
//       if (freeDelivery) {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;

//         // -----------------------

//         result.applyCount = 1;

//         result.totalCount = 0;

//         result.percentage = 0;
//         result.maxDiscount = 0;

//         result.minValue = 0;
//         result.image = "";

//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       } else {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;

//         result.applyCount = applyCount;

//         result.totalCount = totalCount;

//         result.percentage = percentage;
//         result.maxDiscount = maxDiscount;

//         result.minValue = minValue;
//         result.image = image;
//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       }
//     } else {
//       if (freeDelivery) {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;
//         result.restaurant = restaurant;

//         result.applyCount = 1;

//         result.totalCount = 0;

//         result.percentage = 0;
//         result.maxDiscount = 0;

//         result.minValue = 0;
//         result.image = "";
//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       } else {
//         result.title = title;
//         result.code = code;
//         result.couponType = couponType;
//         result.freeDelivery = freeDelivery;
//         result.description = description;
//         result.expire = new Date(expire);
//         result.freeDeliveryApplyCount = freeDeliveryApplyCount;
//         result.newCustomer = newCustomer;

//         result.applyCount = applyCount;

//         result.totalCount = totalCount;

//         result.percentage = percentage;
//         result.maxDiscount = maxDiscount;
//         result.restaurant = restaurant;
//         result.minValue = minValue;
//         result.image = image;
//         await result.save();

//         res.status(200).json({
//           status: "success",
//           message: "Coupon updated successfully",
//           data: result,
//         });
//       }
//     }

//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// });
exports.editCoupon = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      code,
      couponType,
      restaurant,
      freeDelivery,
      freeDeliveryApplyCount,
      applyCount,
      title,
      description,
      totalCount,
      expire,
      percentage,
      maxDiscount,
      newCustomer,
      minValue,
    } = req.body;

    const result = await Coupon.findById(id);
    if (!result) {
      return next(new AppError("Coupon not found"));
    }

    if (req.file) {
      result.image = imageKey; // Set imageKey when an image is uploaded
    } else {
      // Set the image to an empty string if no image was provided
      result.image = "";
    }
    // Check the coupon type and handle creation accordingly
    if (couponType === "admin") {
      if (freeDelivery) {
        result.title = title;
        result.code = code;
        result.couponType = couponType;
        result.freeDelivery = freeDelivery;
        result.description = description;
        result.expire = new Date(expire);
        result.freeDeliveryApplyCount = freeDeliveryApplyCount;
        result.newCustomer = newCustomer;

        // -----------------------

        result.applyCount = 1;

        result.totalCount = 0;

        result.percentage = 0;
        result.maxDiscount = 0;

        result.minValue = 0;
        result.image = "";

        await result.save();

        res.status(200).json({
          status: "success",
          message: "Coupon updated successfully",
          data: result,
        });
      } else {
        result.title = title;
        result.code = code;
        result.couponType = couponType;
        result.freeDelivery = freeDelivery;
        result.description = description;
        result.expire = new Date(expire);
        result.freeDeliveryApplyCount = freeDeliveryApplyCount;
        result.newCustomer = newCustomer;

        result.applyCount = applyCount;

        result.totalCount = totalCount;

        result.percentage = percentage;
        result.maxDiscount = maxDiscount;

        result.minValue = minValue;
        result.image = image;
        await result.save();

        res.status(200).json({
          status: "success",
          message: "Coupon updated successfully",
          data: result,
        });
      }
    } else {
      if (freeDelivery) {
        result.title = title;
        result.code = code;
        result.couponType = couponType;
        result.freeDelivery = freeDelivery;
        result.description = description;
        result.expire = new Date(expire);
        result.freeDeliveryApplyCount = freeDeliveryApplyCount;
        result.newCustomer = newCustomer;
        result.restaurant = restaurant;

        result.applyCount = 1;

        result.totalCount = 0;

        result.percentage = 0;
        result.maxDiscount = 0;

        result.minValue = 0;
        result.image = "";
        await result.save();

        res.status(200).json({
          status: "success",
          message: "Coupon updated successfully",
          data: result,
        });
      } else {
        result.title = title;
        result.code = code;
        result.couponType = couponType;
        result.freeDelivery = freeDelivery;
        result.description = description;
        result.expire = new Date(expire);
        result.freeDeliveryApplyCount = freeDeliveryApplyCount;
        result.newCustomer = newCustomer;

        result.applyCount = applyCount;

        result.totalCount = totalCount;

        result.percentage = percentage;
        result.maxDiscount = maxDiscount;
        result.restaurant = restaurant;
        result.minValue = minValue;
        result.image = image;
        await result.save();

        res.status(200).json({
          status: "success",
          message: "Coupon updated successfully",
          data: result,
        });
      }
    }

    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// Get active coupons
// exports.getCoupon = catchAsync(async (req, res, next) => {
//   const currentDate = new Date();

//   const { page, limit, sort, field } = req.query;
//   const skip = page * limit - limit;

//   const coupons = await Coupon.find({ expire: { $gt: currentDate } })

//     .populate("restaurant")
//     .sort(
//       field
//         ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
//         : { _id: -1 }
//     )
//     .limit(limit || 10)
//     .skip(skip);

//   const total = await Coupon.count({ expire: { $gt: currentDate } });
//   res.status(200).json({
//     data: coupons,
//     total,
//     status: "success",
//     message: "successfully",
//   });
// });
exports.getCoupon = catchAsync(async (req, res, next) => {
  const currentDate = new Date();

  const { page, limit, sort, field, couponType } = req.query;
  const skip = page * limit - limit;

  const filter = {
    expire: { $gt: currentDate },
  };

  if (couponType) {
    filter.couponType = couponType;
  }

  const coupons = await Coupon.find(filter)
    .populate("restaurant")
    .sort(
      field
        ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN }
        : { _id: -1 }
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await Coupon.count(filter);

  res.status(200).json({
    data: coupons,
    total,
    status: "success",
    message: "successfully",
  });
});

// Update coupon visibility
exports.visibleCoupon = catchAsync(async (req, res, next) => {
  const { visible } = req.body;
  const { couponId } = req.query;

  // Update coupon visibility
  await Coupon.findByIdAndUpdate(couponId, { visible });

  res.status(200).json({
    status: "success",
    message: "successfully",
  });
});
//soft Delete
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { couponId } = req.params;

  // Soft delete by updating the 'deleted' field to true
  const deletedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    { $set: { deleted: true } },
    { new: true }
  );

  if (!deletedCoupon) {
    return res.status(404).json({
      status: "fail",
      message: "Coupon not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: deletedCoupon,
    message: "Coupon soft-deleted successfully",
  });
});
