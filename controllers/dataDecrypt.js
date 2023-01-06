const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const crypto = require("crypto");

const secret = "SecretWorld";

const dataDecrypt = async (req, res) => {
  uri = req.body.uri;

  const hash = crypto
    .createHash("sha256", secret)
    .update(req.body.password)
    .digest("hex");

  result = await DataModel.find({ uri });

  if (result.length == 0) {
    res.send("Expired");
  } else if (hash == result[0].password) {
    res.render("pages/decrypt", {
      uri: result[0].uri,
      title: result[0].title,
      filename: result[0].filename,
      expire: result[0].expire,
      burnflag: result[0].burnflag,
    });
  } else {
    res.render("pages/password", { warntext: "Retry!", uri });
  }
};
module.exports = {
  dataDecrypt,
};
