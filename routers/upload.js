const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const router = express.Router();
const stream = require("stream");

const { dataUpload } = require("../controllers/dataUpload");

const storage = multer.memoryStorage();

const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },

  // mypic is the name of file attribute
});
// .array("upload_file")
router.post(
  "/",
  upload.fields([{ name: "upload_file", maxCount: 10 }]),
  dataUpload
);

module.exports = router;
