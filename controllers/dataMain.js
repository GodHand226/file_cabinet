const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
var flag = 0;
const dataMain = async (req, res) => {
  uri = Object.keys(req.query)[0];
  if (uri == undefined) res.render("pages/index");
  else {
    result = await DataModel.find({ uri });

    var diff = (Date.now() - result[0].uploaddate) / 60000;
    if (result[0].burnflag == true && flag == 1) {
      result[0].delete();
      flag = 0;
    } else if (result[0].expire == "5 minutes" && diff >= 5) result[0].delete();
    else if (result[0].expire == "10 minutes" && diff >= 10) result[0].delete();
    else if (result[0].expire == "1 hour" && diff >= 60) result[0].delete();
    else if (result[0].expire == "1 day" && diff >= 1440) result[0].delete();
    else if (result[0].expire == "1 week" && diff >= 10080) result[0].delete();
    else if (result[0].expire == "1 month" && diff >= 525600)
      result[0].delete();
    else if (result.length != 0) {
      res.render("pages/password", { uri });
      flag = 1;
    }
  }
};
module.exports = {
  dataMain,
};
