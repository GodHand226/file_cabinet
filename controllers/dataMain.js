const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");

const dataMain = async (req, res) => {
  uri = Object.keys(req.query)[0];
  if (uri == undefined) res.render("pages/index");
  else {
    result = await DataModel.find({ uri });
    if (result.length != 0) res.render("pages/password", { uri });
  }
};
module.exports = {
  dataMain,
};
