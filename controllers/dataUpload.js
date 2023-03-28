const DataModel = require("../models/uploaddata");
const path = require("path");
const fs = require("fs-extra");
const stream = require("stream");
const crypto = require("crypto");
const { secret_key } = require("../constant");
const { secret } = require("../constant");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//Secret Key used in File Decrypt

function RandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function generateHash(password) {
  const hash = crypto
    .createHash("sha256", secret_key)
    .update(password)
    .digest("hex");
  //secpass is Twice hased string
  const secpass = crypto
    .createHash("sha256", secret_key)
    .update(hash)
    .digest("hex");
  return secpass;
}
const dataUpload = async (req, res) => {
  //hash is Once hased string
  var secpass, title, expire, burnflag;
  var newfilenames = [];
  var origins = [];
  try {
    if (req.busboy) {
      req.busboy.on("file", (fieldname, file, { filename }) => {
        let ext;
        if (filename) {
          ext = path.extname(filename);
        }
        origins.push(filename);
        newfilename = RandomString(10) + "-" + Date.now() + ext;
        newfilenames.push(newfilename);
        // Create a write stream of the new file
        const cipher = crypto.createCipheriv(
          "aes-256-cbc",
          secret.key,
          secret.iv
        );
        if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
        if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");
        const fstream = fs.createWriteStream(
          path.join("uploads/", newfilename)
        );
        // Pipe it trough
        file.pipe(cipher).pipe(fstream);

        // On finish of the upload
        fstream.on("pipe", function () {
          console.log("uploading");
        });
        file.on("error", function (err) {
          res.render("pages/error", {
            error: err,
          });
        });
      });
      req.busboy.on("field", (name, val, info) => {
        if (name == "password") secpass = generateHash(val);
        else if (name == "title") title = val;
        else if (name == "expire") expire = val;
        else if (name == "burnflag") burnflag = val;
      });
      req.busboy.on("error", (err) => {
        res.render("pages/error", {
          error: err,
        });
      });
      req.busboy.on("close", () => {
        const data = new DataModel({
          uri: RandomString(24),
          title: title,
          password: secpass,
          filename: newfilenames,
          originalname: origins,
          expire: expire,
          burnflag: burnflag,
          uploaddate: Date.now(),
          visitflag: false,
        });
        try {
          data.save();
        } catch (error) {
          res.render("pages/error", {
            error: error,
          });
        }

        res.render("pages/preview", {
          uri: data.uri,
          title: title,
          password: secpass,
        });
      });
    }
    req.pipe(req.busboy);
  } catch (e) {
    res.render("pages/error", {
      error: e,
    });
  }
};
module.exports = {
  dataUpload,
};
