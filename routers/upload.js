const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const router = express.Router();
const stream = require("stream");

const { dataUpload } = require("../controllers/dataUpload");

router.post("/", dataUpload);

module.exports = router;
