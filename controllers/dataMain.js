const { UserInfo } = require("git");

const crypto = require("crypto");

const DataModel = require("../models/uploaddata");
const expiretime = require("../constant");

const sec = "SecretWorld";

const dataMain = async (req, res) => {
  const hash = crypto.createHash("sha256", sec).update("").digest("hex");

  uri = Object.keys(req.query)[0];
  if (uri == undefined) res.render("pages/index");
  else {
    result = await DataModel.find({ uri });
    if (result.length == 0) {
      res.send("Expired");
    } else {
      var diff = Date.now() - result[0].uploaddate;
      diff = diff > 0 ? diff : 0;
      diff = diff / 1000;

      if (expiretime[result[0].expire] < diff) result[0].delete();
      else if (result[0].password != hash) {
        res.render("pages/password", { uri });
      } else {
        res.render("pages/decrypt", {
          uri: result[0].uri,
          title: result[0].title,
          filename: result[0].filename,
          expire: result[0].expire,
          burnflag: result[0].burnflag,
        });
      }
    }
  }
};
module.exports = {
  dataMain,
};
