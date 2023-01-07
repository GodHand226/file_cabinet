const { UserInfo } = require("git");

const crypto = require("crypto");

const DataModel = require("../models/uploaddata");
const { expiretime } = require("../constant");

const sec = "SecretWorld";

const dataMain = async (req, res) => {
  const hash = crypto.createHash("sha256", sec).update("").digest("hex");
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");
  uri = Object.keys(req.query)[0];
  if (uri == undefined) res.render("pages/index");
  else {
    result = await DataModel.find({ uri });
    if (result.length == 0) {
      res.render("pages/expired");
    } else {
      var diff = Date.now() - result[0].uploaddate;
      diff = diff > 0 ? diff : 0;
      diff = diff / 1000;

      if (result[0].burnflag == true) {
        if (result[0].visitflag == true) {
          result[0].delete();
          res.render("pages/expired.ejs");
        }
      } else if (expiretime[result[0].expire] < diff) {
        result[0].delete();
        res.render("pages/expired.ejs");
      } else if (result[0].password != secpass) {
        res.render("pages/password", { warntext: "", uri });
      } else {
        res.render("pages/decrypt", {
          uri: result[0].uri,
          title: result[0].title,
          filename: result[0].filename,
          expire: result[0].expire,
          burnflag: result[0].burnflag,
        });
        result[0].visitflag = true;
        result[0].save();
      }
    }
  }
};
module.exports = {
  dataMain,
};
