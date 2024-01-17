require("dotenv");
const fs = require("fs");
const AWS = require("aws-sdk");
const multer = require("multer");

const bucketName = process.env.BUCKET_NAME;

const s3BucketEndpoint = new AWS.Endpoint(process.env.STORAGE_END_POINT);
const s3 = new AWS.S3({
  endpoint: s3BucketEndpoint,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

exports.uploadImg = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
    ACL: "public-read",
  };
  const response = await s3.upload(uploadParams).promise();
  fs.unlinkSync(file.path);
  return response;
};

exports.deleteFile = async (fileKey) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };
  return s3.deleteObject(params).promise();
};

exports.getFileStream = async (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return await s3
    .getObject(downloadParams)
    .createReadStream()
    .on("error", (err) => {
      console.log(err);
    });
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "temp/";
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `${new Date().getTime()}${Math.floor(
        Math.random() * 100000000000
      )}.${ext}`
    );
  },
});

exports.imageUpload = multer({
  storage: imageStorage,
});
