const express = require("express");
const router = express.Router();

const { dataDecrypt } = require("../controllers/dataDecrypt");

router.use((req, res, next) => {
  next();
});

router.post("/", dataDecrypt);

module.exports = router;
