const { UserInfo, FileIndex } = require("git");

const DataModel = require("../models/uploaddata");
const path = require("path");
const fs = require("fs-extra");
const stream = require("stream");
const crypto = require("crypto");

const sec = "SecretWorld";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//Secret Key used in File Decrypt
const secret = {
  iv: Buffer.from("8e800da9971a12010e738df5fdfe0bb7", "hex"),
  key: Buffer.from(
    "dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c",
    "hex"
  ),
};

function RandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const dataUpload = async (req, res) => {
  //hash is Once hased string
  const hash = crypto.createHash("sha256", sec).update(" ").digest("hex");
  //secpass is Twice hased string
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");

  var newfilenames = [];
  var origins = [];

  req.pipe(req.busboy);
  req.busboy.on("file", (fieldname, file, { filename }) => {
    const ext = path.extname(filename);
    origins.push(filename);
    newfilename = RandomString(10) + "-" + Date.now() + ext;
    newfilenames.push(newfilename);
    // Create a write stream of the new file
    const cipher = crypto.createCipheriv("aes-256-cbc", secret.key, secret.iv);

    const fstream = fs.createWriteStream(path.join("uploads/", newfilename));
    // Pipe it trough
    file.pipe(cipher).pipe(fstream);
    // On finish of the upload
    fstream.on("finish", function () {});
  });
  req.busboy.on("close", () => {
    const data = new DataModel({
      uri: RandomString(24),
      title: req.body.title,
      password: secpass,
      filename: newfilenames,
      originalname: origins,
      expire: req.body.expire,
      burnflag: req.body.burnflag,
      uploaddate: Date.now(),
      visitflag: false,
    });
    try {
      data.save();
    } catch (error) {
      res.send(error);
    }

    res.render("pages/preview", {
      uri: data.uri,
      title: req.body.title,
      password: secpass,
    });
  });
};
module.exports = {
  dataUpload,
};
