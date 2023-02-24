const { UserInfo } = require("git");

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const DataModel = require("../models/uploaddata");
const { expiretime } = require("../constant");
const { secret_key } = require("../constant");
const { MONTH } = require("../constant");
//hash key
const sec = secret_key;
//Secret Key used in File Decrypt
const secret = {
  iv: Buffer.from("8e800da9971a12010e738df5fdfe0bb7", "hex"),
  key: Buffer.from(
    "dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c",
    "hex"
  ),
};

const decrypt = (src, dest) => {
  const initVect = crypto.randomBytes(16);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secret.key,
    secret.iv
  );
  const input = fs.createReadStream(path.join("uploads/", src));
  const output = fs.createWriteStream(path.join("downloads/", dest));
  input.pipe(decipher).pipe(output);
  output.on("finish", function () {
    console.log("Encrypted file written to disk!");
  });
};

const checkDatabase = async () => {
  database = await DataModel.find();
  await Promise.all(
    database.map(async (data, index) => {
      var diff = Date.now() - data.uploaddate;
      diff = diff > 0 ? diff : 0;
      diff = diff / 1000;
      if (data.burnflag == true) {
        if (data.visitflag == true || diff > MONTH) {
          //Burn if once visited
          if (data.filename) {
            if (fs.existsSync("uploads/" + data.filename))
              fs.unlinkSync("uploads/" + data.filename);
            if (fs.existsSync("downloads/" + data.filename))
              fs.unlinkSync("downloads/" + data.filename);
          }
          await DataModel.findByIdAndDelete(data._id);
        }
      } else if (expiretime[data.expire] < diff) {
        //expire time is over
        if (data.filename) {
          if (fs.existsSync("uploads/" + data.filename))
            fs.unlinkSync("uploads/" + data.filename);
          if (fs.existsSync("downloads/" + data.filename))
            fs.unlinkSync("downloads/" + data.filename);
        }
        await DataModel.findByIdAndDelete(data._id);
      }
    })
  );
};

const dataMain = async (req, res) => {
  //hash is once, and secpass is twice hased string with space
  const hash = crypto.createHash("sha256", sec).update("").digest("hex");
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");
  uri = Object.keys(req.query)[0];
  await checkDatabase();

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

      if (result[0].burnflag && result[0].visitflag) {
        //Burn if once visited
        result[0].delete();
        return res.render("pages/expired.ejs");
      }

      if (result[0].password != secpass) {
        return res.render("pages/password", { warntext: "", uri });
      }

      if (result[0].filename) {
        //if password is correct and file exists, decrypt file and save it to 'downloads' folder in server
        for (var i = 0; i < result[0].filename.length; i++) {
          await decrypt(result[0].filename[i], result[0].filename[i]);
        }
      }
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
};
module.exports = {
  dataMain,
};
