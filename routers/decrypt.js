const express = require("express");
const router = express.Router();

const { dataDecrypt } = require("../controllers/dataDecrypt");

router.post("/", dataDecrypt);

module.exports = router;
