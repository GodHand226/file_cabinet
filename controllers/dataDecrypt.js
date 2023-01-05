const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");

const dataDecrypt = async (req, res) => {
  console.log(req.body);
  uri = req.body.uri;
  password = req.body.password;
  result = await DataModel.find({ uri });
  if (password == result[0].password) {
    res.render("pages/decrypt", {
      title: result[0].title,
      filename: result[0].filename,
    });
  } else {
    res.send("Failed");
  }
};
module.exports = {
  dataDecrypt,
};
