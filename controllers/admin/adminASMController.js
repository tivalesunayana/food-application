// Import required modules and models
const catchAsync = require("../../utils/catchAsync"); // Importing the catchAsync utility for error handling
const ASM = require("./../../models/asm/asmModel"); // Importing the ASM model

// Create a new ASM (Assistance Sales Manager) record
exports.createAsm = catchAsync(async (req, res, next) => {
  // Extracting data from the request body
  const { name, email, gender, phone, designation } = req.body;

  // Creating a new ASM record in the database
  const asm = await ASM.create({
    name,
    email,
    gender,
    phone,
    designation,
    location: {
      type: "Point",
      coordinates: [72.9718669, 19.1917026],
    },
  });

  // Sending a response with the created ASM object and a success message
  res
    .status(200)
    .json({ asm, status: "success", message: "ASM created successfully" });
});

// Retrieve a list of ASM records
exports.getASM = catchAsync(async (req, res, next) => {
  // Extracting query parameters for pagination and sorting
  const { page, limit, sort, field } = req.query;

  // Calculating the number of records to skip for pagination
  const skip = page * limit - limit;

  // Querying the database to retrieve ASM records
  const asm = await ASM.find()
    .sort(
      field ? { [field]: sort === "asc" ? -1 : sort === "desc" ? 1 : NaN } : {}
    )
    .limit(limit || 10) // Limiting the number of results per page, default to 10 if not provided
    .skip(skip);

  // Counting the total number of ASM records in the database
  const total = await ASM.count();

  // Sending a response with the retrieved ASM records, total count, and a success message
  res.status(200).json({
    data: asm,
    total,
    status: "success",
    message: "Successfully retrieved ASM records",
  });
});

exports.getLiveLocationOfASM = catchAsync(async (req, res, next) => {
  const asm = await ASM.find({});
  const data = [];
  for (let index = 0; index < asm.length; index++) {
    const element = asm[index];
    data.push({
      type: "Feature",
      properties: {
        description: `<strong>${element.name}</strong><p></p>`,
      },
      geometry: {
        type: "Point",
        coordinates: element.location.coordinates,
      },
    });
  }

  res.status(200).json({
    status: "success",
    message: "Success",
    data: data,
  });
});
