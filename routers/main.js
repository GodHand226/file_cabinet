const express = require("express");
const router = express.Router();

const { dataMain } = require("../controllers/dataMain");

router.use((req, res, next) => {
  next();
});

router.get("/", dataMain);

module.exports = router;
