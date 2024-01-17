const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const validator = require("validator");
const documentSchema = new mongoose.Schema(
  {
    documentFile: {
      type: String,
    },
    documentType: {
      type: String,
    },
    gstNumber: { type: String },
    aadharNumber: { type: String },
    expire: {
      type: Date,
    },

    fileType: {
      type: String,
    },
    restaurant: { type: String },
    certificateNo: { type: String },
    issueData: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
