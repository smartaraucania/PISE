/**
 * EN DESARROLLO: Subida de archivos a S3 o Cloudinary
 */

// const multer = require("multer");
// const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");
const constants = require("./constants");

const AWS = require("aws-sdk");

const ID = constants.AWS_ID;
const SECRET = constants.AWS_KEY;
const BUCKET_NAME = constants.AWS_BUCKET_NAME;

const fs = require("fs");

exports.upload = function(req, res) {
  return new Promise(function(resolve, reject) {
    AWS.config.setPromisesDependency();
    AWS.config.update({
      accessKeyId: ID,
      secretAccessKey: SECRET,
      region: "sa-east-1"
    });
    const s3 = new AWS.S3();

    var params = {
      ACL: "public-read",
      ContentType: req.file.mimetype,
      Bucket: BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      Key: new Date().getUTCMilliseconds() + req.file.originalname
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }

      if (data) {
        fs.unlink(req.file.path, function(err) {
          const locationUrl = data.Location;
          resolve(locationUrl);
        });
      }
    });
  });
};

// cloudinary.config({
//     cloud_name: constants.CLOUDINARY_NAME,
//     api_key: constants.CLOUDINARY_ACCESS_KEY,
//     api_secret: constants.CLOUDINARY_SECRET_KEY
// });
// const storage = cloudinaryStorage({
//     cloudinary: cloudinary,
//     folder: "pictures",
//     allowedFormats: ["jpg", "png"],
//     transformation: [{
//         width: 500,
//         height: 500,
//         crop: "thumb"
//     }]
// });
// const parser = multer({
//     storage: storage
// });
