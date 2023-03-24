const fs = require("fs");
const path = require("path");
const stream = require("stream");
const crypto = require("crypto");
const { secret_key } = require("../constant");
const { secret } = require("../constant");
const DataModel = require("../models/uploaddata");

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
    // console.log("Encrypted file written to disk!");
  });
};
const dataDecrypt = async (req, res) => {
  uri = req.body.uri;
  //hash is Once hased string
  const hash = crypto
    .createHash("sha256", secret_key)
    .update(req.body.password)
    .digest("hex");
  //secpass is Twice hased string
  const secpass = crypto
    .createHash("sha256", secret_key)
    .update(hash)
    .digest("hex");

  result = await DataModel.find({ uri });

  if (result.length == 0) {
    //Display 'Expired' message
    res.render("pages/expired");
  } else if (secpass == result[0].password) {
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
  } else {
    //if password is incorrect, let retry!
    res.render("pages/password", { warntext: "exactly", uri });
  }
};
module.exports = {
  dataDecrypt,
};
