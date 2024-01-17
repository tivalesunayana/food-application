const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
  },

  autoApproved: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
  },
  permissions: {
    admin: {
      type: Boolean,
      default: false,
    },
    dashboard: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: Boolean,
      default: false,
    },
    cuisine: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: Boolean,
      default: false,
    },
    complain: {
      type: Boolean,
      default: false,
    },
    delivery: {
      type: Boolean,
      default: false,
    },
    banner: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: Boolean,
      default: false,
    },
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

AdminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
