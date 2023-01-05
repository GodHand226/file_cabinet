const express = require("express");
const multer = require("multer");

const router = express.Router();

const { dataUpload } = require("../controllers/dataUpload");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function RandomString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, RandomString(10) + "-" + Date.now() + ".jpg");
  },
});

const maxSize = 1 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },

  // mypic is the name of file attribute
}).single("upload_file");

router.post("/", upload, dataUpload);

module.exports = router;
