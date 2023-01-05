const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");

const dataDownload = async (req, res) => {
  uri = req.body.uri;
  result = await DataModel.find({ uri });
  if (req.body.file) {
    res.download(
      "uploads/" + result[0].filename,
      "downloads/" + result[0].filename
    );
  }
};
module.exports = {
  dataDownload,
};
