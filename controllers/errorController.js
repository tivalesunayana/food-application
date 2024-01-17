const AppError = require("./../utils/appError");
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = ` Invalid imput data. ${errors.join(". ")} `;
  return new AppError(message, 400);
};
const handleJWTError = () => new AppError("invalid toke login again ", 401);

const handleJWTExpire = () => new AppError("jwt Token expire", 401);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  // const value = err.keyValue.name;
  // console.log(value);
  const message = `Duplicate field value: ${err.keyValue.name}. please use another value!`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR ", err);
    res.status(500).json({
      status: "error",
      message: "Something went worng!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = "error";

  if (process.env.NODE_ENV === "development") {
    console.log(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log(err.name);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "invalid signature") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpire();
    sendErrorPro(error, res);
  }
};
