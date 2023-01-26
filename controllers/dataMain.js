const { UserInfo } = require("git");

const crypto = require("crypto");

const DataModel = require("../models/uploaddata");
const { expiretime } = require("../constant");
const { MONTH } = require("../constant");
//hash key
const sec = "SecretWorld";

const checkDatabase = async () => {
  database = await DataModel.find();
  database.map((data) => {
    var diff = Date.now() - data.uploaddate;
    diff = diff > 0 ? diff : 0;
    diff = diff / 1000;

    if (data.burnflag == true) {
      if (data.visitflag == true || diff > MONTH) {
        //Burn if once visited
        data.delete();
      }
    } else if (expiretime[data.expire] < diff) {
      //expire time is over
      data.delete();
    }
  });
};

const dataMain = async (req, res) => {
  //hash is once, and secpass is twice hased string with space
  const hash = crypto.createHash("sha256", sec).update("").digest("hex");
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");

  uri = Object.keys(req.query)[0];
  checkDatabase();
  if (uri == undefined) {
    //Not existing params
    res.render("pages/index");
  } else {
    result = await DataModel.find({ uri });
    if (result.length == 0) {
      //Display 'Expire' message
      res.render("pages/expired");
    } else {
      //Calculate expire time
      var diff = Date.now() - result[0].uploaddate;
      diff = diff > 0 ? diff : 0;
      diff = diff / 1000;

      if (result[0].password != secpass) {
        return res.render("pages/password", { warntext: "", uri });
      }
      if (result[0].burnflag == true) {
        if (result[0].visitflag == true) {
          //Burn if once visited
          result[0].delete();
          res.render("pages/expired.ejs");
        } else {
          res.render("pages/decrypt", {
            uri: result[0].uri,
            title: result[0].title,
            filename: result[0].filename,
            originalname: result[0].originalname,
            expire: result[0].expire,
            burnflag: result[0].burnflag,
          });
          //Set visitflag true for 'Burn After Reading'
          result[0].visitflag = true;
          result[0].save();
        }
      }
    }
  }
};
module.exports = {
  dataMain,
};
