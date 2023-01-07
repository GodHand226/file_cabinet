const express = require("express");
const router = express.Router();

const { dataDownload } = require("../controllers/dataDownload");

router.post("/", dataDownload);

module.exports = router;
