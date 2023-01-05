const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");

const dataDecrypt = async (req, res) => {
  uri = req.body.uri;
  password = req.body.password;
  result = await DataModel.find({ uri });
  if (password == result[0].password) {
    console.log({ burnflag: result[0].burnflag });
    res.render("pages/decrypt", {
      uri: result[0].uri,
      title: result[0].title,
      filename: result[0].filename,
      expire: result[0].expire,
      burnflag: result[0].burnflag,
    });
  } else {
    res.send("Failed");
  }
};
module.exports = {
  dataDecrypt,
};
