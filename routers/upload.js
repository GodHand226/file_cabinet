const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const router = express.Router();
const stream = require("stream");

const { dataUpload } = require("../controllers/dataUpload");

const CryptoAlgorithm = "aes-256-cbc";

// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const secret = {
  iv: Buffer.from("efb2da92cff888c9c295dc4ee682789c", "hex"),
  key: Buffer.from(
    "6245cb9b8dab1c1630bb3283063f963574d612ca6ec60bc8a5d1e07ddd3f7c53",
    "hex"
  ),
};

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

/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const parts = file.originalname.split(".");
    const ext = parts.pop();
    const name = parts.join(".");
    cb(null, RandomString(10) + "-" + Date.now() + "." + ext);
  },
}); */

const storage = multer.memoryStorage();

const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },

  // mypic is the name of file attribute
}).single("upload_file");

router.post("/", upload, dataUpload);

module.exports = router;
