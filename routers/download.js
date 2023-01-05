const express = require("express");
const router = express.Router();

const { dataDownload } = require("../controllers/dataDownload");

router.use((req, res, next) => {
  next();
});

router.post("/", dataDownload);

module.exports = router;
