// Import required modules and models
const Admin = require("./../../models/admin/adminModel"); // Import the Admin model
const jwt = require("jsonwebtoken"); // Import JSON Web Token library
const nodemailer = require("nodemailer"); // Import Nodemailer for sending emails

const AdminOTP = require("./../../models/admin/adminOTP"); // Import the AdminOTP model

// Function to sign a JSON Web Token (JWT) for authentication
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to create and send a JWT token as a cookie
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 62 * 62 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  admin.password = undefined;
  res.cookie("bearerTokenAdmin", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    message: "Login Successfully",
    data: {
      admin,
      token,
    },
  });
};

// Middleware to protect routes requiring authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.cookie) {
      const value = req.headers.cookie.split("bearerTokenAdmin=")[1];
      token = value.split(";")[0];
      console.log(`admin Auth Token:${token}`);
      if (!token) {
        // Unauthorized if token is missing
        res.status(401).json({
          status: "unauthorized",
          message: "You are not logged in! Please log in to get access",
        });
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentAdmin = await Admin.findById(decoded.id);
        if (!currentAdmin) {
          // Unauthorized if user not found
          res.status(404).json({
            status: "not found",
            message: "User not found",
          });
        } else {
          req.admin = currentAdmin;
          next();
        }
      }
    } else {
      res.status(404).json({
        status: "not found",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    // Unauthorized if token verification fails
    res.status(401).json({
      status: "unauthorized",
      message: "You are not logged in! Please log in to get access",
    });
  }
};

// Middleware to protect socket connections
exports.socketProtect = async (socket, next) => {
  if (socket.request.headers.cookie) {
    const value = socket.request.headers.cookie.split("bearerTokenAdmin=")[1];
    const token = value.split(";")[0];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentAdmin = await Admin.findById(decoded.id);
      if (currentAdmin) {
        socket.admin = currentAdmin;
        next();
      }
    }
  }
};

// Function to delete an admin user
exports.deleteAdminUser = async (req, res) => {
  try {
    if (process.env.SUPERADMINID === req.params.id) {
      // Cannot delete Super Admin
      res.status(401).json({
        status: "conflict",
        message: "You cannot delete the Super Admin",
      });
    } else {
      const admin = await Admin.findById(req.params.id);
      if (admin) {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({
          status: "success",
          message: "Admin User Deleted Successfully",
        });
      } else {
        // Admin not found
        res.status(404).json({
          status: "not found",
          message: "Admin User not found",
        });
      }
    }
  } catch (error) {
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to handle admin user signup
exports.adminSignup = async (req, res) => {
  try {
    // Check if password and password confirmation match
    if (req.body.passwordConfirm === req.body.password) {
      const checkUser = await Admin.findOne({ email: req.body.email });

      if (!checkUser) {
        // Create a new admin user if email doesn't exist
        const user = await Admin.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          designation: req.body.designation,
          permissions: req.body.permissions,
        });
        user.password = undefined; // Hide password from response
        res.status(200).json({
          status: "success",
          message: "Admin User Created",
          data: {
            user,
          },
        });
      } else {
        // Email already exists
        res.status(409).json({
          status: "conflict",
          message: "Email already exists",
        });
      }
    } else {
      // Password mismatch
      res.status(403).json({
        status: "forbidden",
        message: "Passwords should match",
      });
    }
  } catch (error) {
    console.log("Error with signup", error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to handle admin user login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // Missing email or password
      res.status(404).json({
        status: "not found",
        message: "Enter Email and Password",
      });
    } else {
      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin || !(await admin.correctPassword(password, admin.password))) {
        // Invalid credentials
        res.status(403).json({
          status: "unauthorized",
          message: "Invalid Username or Password",
        });
      } else {
        // Successful login
        createSendToken(admin, 200, res);
      }
    }
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to retrieve admin dashboard data
exports.dashboard = async (req, res) => {
  try {
    const admin = req.admin;
    // Send dashboard data
    res.status(200).json({
      status: "success",
      message: "Successful",
      admin,
    });
  } catch (error) {
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to send an OTP for password reset
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      // Missing email
      res.status(401).json({
        status: "unauthorized",
        message: "Invalid Email Id",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Email not found
      res.status(404).json({
        status: "not found",
        message: "Email id not found",
      });
    } else {
      // Generate and send OTP
      const otp =
        `${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}${Math.trunc(Math.random() * 9 + 1)}${Math.trunc(
          Math.random() * 9 + 1
        )}` * 1;

      const checkOTP = await AdminOTP.findOne({ email });

      if (!checkOTP) {
        await AdminOTP.create({
          email,
          otp,
        });

        // Send OTP via email
        // ...
        res.status(200).json({
          status: "success",
          message: "OTP Sent To Your Email Id",
        });
      } else {
        // Update existing OTP and send via email
        checkOTP.otp = otp;
        await checkOTP.save();
        // Send OTP via email
        // ...
        res.status(200).json({
          status: "success",
          message: "OTP Sent To Your Email Id",
        });
      }
    }
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to change password using OTP
exports.changePasswordOTP = async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    const otp = req.body.otp * 1;

    const checkEmail = await Admin.findOne({ email }).select("+password");
    if (checkEmail) {
      const adminOTP = await AdminOTP.findOne({ email });
      const otpDate = new Date(adminOTP.updatedAt.getTime() + 10 * 60000);

      if (adminOTP.otp === otp && otpDate > new Date(Date.now())) {
        // Update password using OTP
        checkEmail.password = password;
        checkEmail.passwordConfirm = passwordConfirm;
        await checkEmail.save();

        res.status(200).json({
          status: "success",
          message: "Password changed successfully",
        });
      } else if (otpDate < new Date(Date.now())) {
        // Expired OTP
        res.status(401).json({
          status: "unauthorized",
          message: "OTP Expired",
        });
      } else {
        // Incorrect OTP
        res.status(401).json({
          status: "unauthorized",
          message: "Incorrect OTP",
        });
      }
    }
  } catch (error) {
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to handle admin user logout
exports.logOut = async (req, res) => {
  try {
    // Clear bearerTokenAdmin cookie to log out
    res
      .status(200)
      .clearCookie("bearerTokenAdmin")
      .json({ message: "Logout successfully", status: "success" });
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Function to update admin user profile
exports.adminProfileUpdate = async (req, res) => {
  try {
    const { name } = req.body;
    const admin = req.admin;
    const adminProfile = await Admin.findByIdAndUpdate(
      admin._id,
      {
        name: name,
      },
      { new: true }
    );

    // Update and send updated profile data
    res.status(200).json({
      status: "success",
      message: "Admin Profile updated successfully",
      data: adminProfile,
    });
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to retrieve all admin users
exports.getAllAdmins = async (req, res) => {
  try {
    const admin = await Admin.find();

    // Send list of admin users
    res.status(200).json({
      status: "success",
      admin,
    });
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to update admin user profile password
exports.profilePasswordUpdate = async (req, res) => {
  try {
    const { oldPassword, password, passwordConfirm } = req.body;
    const adminText = req.admin;

    if (password === passwordConfirm || oldPassword !== null) {
      const admin = await Admin.findById(adminText._id).select("+password");
      const match = await admin.correctPassword(oldPassword, admin.password);

      if (match === true) {
        // Update password
        admin.password = password;
        admin.passwordConfirm = passwordConfirm;
        await admin.save();

        res.status(200).json({
          status: "success",
          message: "Password changed successfully",
        });
      } else {
        // Incorrect current password
        res.status(203).json({
          status: "success",
          message: "Enter Valid Current Password",
        });
      }
    } else {
      // Passwords don't match or missing old password
      res.status(409).json({
        status: "conflict",
        message: "Passwords Must Match or Enter Valid Old Password",
      });
    }
  } catch (error) {
    console.log(error);
    // Internal server error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
