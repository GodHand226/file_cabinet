const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const crypto = require("crypto");

const dataDownload = async (req, res) => {
  uri = req.body.uri;
  result = await DataModel.find({ uri });
  if (result.length == 0) {
    res.send("Failed");
  } else if (req.body.file) {
    //Downloads image from downloads in server to client
    res.download("downloads/" + result[0].filename, result[0].filename);
  }
};
module.exports = {
  dataDownload,
};
