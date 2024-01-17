const Customer = require("../../models/customer/customerModel");
const catchAsync = require("../../utils/catchAsync");

// Get customer data with pagination and sorting
exports.getCustomer = catchAsync(async (req, res, next) => {
  const { page, limit, sort, field } = req.query;
  const skip = page * limit - limit;

  // Fetch customer data based on provided filters and pagination
  const customer = await Customer.find()
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10)
    .skip(skip);

  // Count total number of customers
  const total = await Customer.count();

  // Send the customer data as response
  res.status(200).json({
    customer,
    total,
    status: "success",
    message: "successfully",
  });
});
