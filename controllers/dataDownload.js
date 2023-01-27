const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const path = require("path");
const zip = require("express-zip");
const fs = require("fs");
const stream = require("stream");
const crypto = require("crypto");

const dataDownload = async (req, res) => {
  uri = req.body.uri;
  result = await DataModel.find({ uri });
  var files = [];
  if (result.length == 0) {
    res.send("Failed");
  } else {
    files = result[0].filename.map((fn, index) => ({
      path: "downloads/" + fn,
      name: result[0].originalname[index],
    }));
  }

  if (files.length > 1) res.zip(files);
  else {
    const url = "downloads/" + result[0].filename[0];
    await res.download(url, result[0].originalname[0]);
  }
};
module.exports = {
  dataDownload,
};
