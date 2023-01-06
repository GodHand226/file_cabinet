const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const expiretime = require("../constant");

const dataMain = async (req, res) => {
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
      else {
        res.render("pages/password", { uri });
      }
    }
  }
};
module.exports = {
  dataMain,
};
