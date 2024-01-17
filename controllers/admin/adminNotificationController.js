const {
  sendNotificationToAll,
  sendNotificationToAllWithImage,
} = require("../../config/firebase");
const { uploadImg } = require("../../config/s3config");
const catchAsync = require("../../utils/catchAsync");
const DeliveryPartnerNotification = require("../../models/deliveryPartner/deliveryPartnerNotificationModel");
const CustomerNotification = require("../../models/customer/customerNotificationModel");
const RestaurantNotification = require("../../models/restaurant/restaurantNotificationModel");
// exports.sendNotificationForCustomer = catchAsync(async (req, res, next) => {
//   const { title, message } = req.body;
//   const file = req.file;
//   if (file) {
//     const response = await uploadImg(file);
//     sendNotificationToAllWithImage(
//       title,
//       message,
//       `${process.env.S3URL}/${response.Key}`,
//       "customerApp"
//     );
//     // console.log(req.file);
//     res.status(200).json({ message: "Notification send successfully" });
//   } else {
//     sendNotificationToAll(title, message, "customerApp");
//     res.status(200).json({ message: "Notification send successfully" });
//   }
// });
exports.sendNotificationForCustomer=catchAsync(async(req,res,next)=>{
  const {title,message}=req.body;
  const file=req.file;
  if(file){
    const response =await uploadImg(file);
    sendNotificationToAllWithImage(
      title,
      message,
      `${process.env.S3URL}/${response.Key}`,
      "customerApp"
    );
    const data =await CustomerNotification.create({
      title,description:message,
      image:response.Key,
    });
    res.status(200).json({message:"Notification send successfully",data})
  }
  else {
    const data = await DeliveryPartnerNotification.create({
      title,
      description: message,
    });
    sendNotificationToAll(title, message, "deliveryPartnerApp");
    res.status(200).json({ message: "Notification send successfully" });
  }
  });
  exports.sendNotificationForRestaurant=catchAsync(async(req,res,next)=>{
    const { title, message } = req.body;
console.log('req.body:', req.body);
    const file=req.file;
    if(file){
      const response =await uploadImg(file);
      this.sendNotificationToAllWithImage(
        title,
        message,
        `${process.env.S3URL}/${response.Key}`,
        "restaurantPartnerApp"
      );
      const data = await RestaurantNotification.create({
        title,
        description:message,
        image:response.Key,
      });

      res.status(200).json({message:"Notification Send successfully",data})
      
    }
    else {
      const data = await RestaurantNotification.create({
        title,
        description: message,
      });
      sendNotificationToAll(title, message, "restaurantPartnerApp");
      res.status(200).json({ message: "Notification send successfully" ,data});
    }
  });
// exports.sendNotificationForRestaurant = catchAsync(async (req, res, next) => {
//   const { title, message } = req.body;
//   const file = req.file;
//   if (file) {
//     const response = await uploadImg(file);
//     sendNotificationToAllWithImage(
//       title,
//       message,
//       `${process.env.S3URL}/${response.Key}`,
//       "restaurantPartnerApp"
//     );
//     console.log("restaurantPartnerApp");
//     res.status(200).json({ message: "Notification send successfully" });
//   } else {
//     sendNotificationToAll(title, message, "restaurantPartnerApp");
//     res.status(200).json({ message: "Notification send successfully",data });
//   }
// });

exports.getNotificationForRestauarnt = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const restaurantNotification = await RestaurantNotification.find()

    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await RestaurantNotification.count();
  res.status(200).json({
    data: restaurantNotification,
    total,
    status: "success",
    message: "successfully",
  });
});
exports.getNotificationForCustomer = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const customerNotification = await CustomerNotification.find()

    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await CustomerNotification.count();
  res.status(200).json({
    data: customerNotification,
    total,
    status: "success",
    message: "successfully",
  });
});
exports.getNotificationForDelivery = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;
  const deliveryNotification = await DeliveryPartnerNotification.find()

    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  const total = await DeliveryPartnerNotification.count();
  res.status(200).json({
    data: deliveryNotification,
    total,
    status: "success",
    message: "successfully",
  });
});

exports.sendNotificationForDelivery = catchAsync(async (req, res, next) => {
  const { title, message } = req.body;
  const file = req.file;
  if (file) {
    const response = await uploadImg(file);
    sendNotificationToAllWithImage(
      title,
      message,
      `${process.env.S3URL}/${response.Key}`,
      "deliveryPartnerApp"
    );
    const data = await DeliveryPartnerNotification.create({
      title,
      description: message,
      image: response.Key,
    });

    res.status(200).json({ message: "Notification send successfully" ,data});
  } else {
    const data = await DeliveryPartnerNotification.create({
      title,
      description: message,
    });
    sendNotificationToAll(title, message, "deliveryPartnerApp");
    res.status(200).json({ message: "Notification send successfully" });
  }
});


exports.updateNotificationForCustomer = catchAsync(async (req, res, next) => {
  const { notificationId } = req.query;
  const { show } = req.body;

  await CustomerNotification.findByIdAndUpdate(notificationId, {
    show,
  });

  res.status(200).json({
    status: "success",
    message: "successfully updated customer announcement",
  });
});
exports.updateNotificationForRestaurant = catchAsync(async (req, res, next) => {
  const { notificationId } = req.query;
  const { show } = req.body;

  const restaurantNotification =await RestaurantNotification.findByIdAndUpdate(notificationId, {
    show,
  });

  res.status(200).json({
    status: "success",
    data:restaurantNotification,
    message: "successfully updated restaurant announcement",
  });
});

exports.updateNotificationForDelivery = catchAsync(async (req, res, next) => {
  const { notificationId } = req.query;
  const { show } = req.body;

  await DeliveryPartnerNotification.findByIdAndUpdate(notificationId, {
    show,
  });

  res.status(200).json({
    status: "success",
    message: "successfully updated delivery announcement",
  });
});
