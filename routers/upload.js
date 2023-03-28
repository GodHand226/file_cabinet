const express = require("express");
const router = express.Router();

const { dataUpload } = require("../controllers/dataUpload");

router.post("/", dataUpload);

module.exports = router;
