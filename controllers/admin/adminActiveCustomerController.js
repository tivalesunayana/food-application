const catchAsync = require("../../utils/catchAsync");
const customer = require("../../models/customer/customerModel");
const moment = require("moment/moment");

exports.activeCustomer = catchAsync(async (req, res, next) => {
  try {
    const allCustomers = await customer
      .find()
      .populate({ path: "addresses", model: "Address" });
    let activeCustomers = [];
    for (let index = 0; index < allCustomers.length; index++) {
      let updatedDate = allCustomers[index].updatedAt;
      let compareDate = moment().subtract({ days: 7 }).format("YYYY-MM-DD");

      if (moment(updatedDate).format("YYYY-MM-DD") >= compareDate) {
        activeCustomers.push(allCustomers[index]);
      }
    }
    res.status(200).json({
      data: activeCustomers,
      message: "Currently Active Customers",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
