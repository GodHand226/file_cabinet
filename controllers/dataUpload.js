const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const crypto = require("crypto");

const sec = "SecretWorld";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//Secret Key used in File Decrypt
const secret = {
  iv: Buffer.from("b7b15651664bbec3a3f96ad8a90c05ab", "hex"),
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

const CryptoAlgorithm = "aes-256-cbc";
//Generate encrypt variable
function encrypt(algorithm, buffer, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
}
//Generate decrypt variable
function decrypt(algorithm, buffer, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}
//Generate encrypted filepath
function getEncryptedFilePath(filePath) {
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) + path.extname(filePath)
  );
}
//Encrypt File and save it to encrypted filePath
function saveEncryptedFile(buffer, filePath, key, iv) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, encrypted);
}

//Decrypt File and save it to decrypted filePath
function saveDecryptedFile(buffer, filePath, key, iv) {
  const decrypted = decrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, decrypted);
}

const dataUpload = async (req, res) => {
  //hash is Once hased string
  const hash = crypto
    .createHash("sha256", sec)
    .update(req.body.password)
    .digest("hex");
  //secpass is Twice hased string
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");
  var newfilename;

  if (req.file) {
    const ext = path.extname(req.file.originalname);
    newfilename = RandomString(10) + "-" + Date.now() + ext;
    //save encrypted file with encrypted filename
    saveEncryptedFile(
      req.file.buffer,
      path.join("uploads/", newfilename),
      secret.key,
      secret.iv
    );
  }

  const data = new DataModel({
    uri: RandomString(24),
    title: req.body.title,
    password: secpass,
    filename: req.file ? newfilename : "",
    originalfilename: req.file.originalname,
    expire: req.body.expire,
    burnflag: req.body.burnflag,
    uploaddate: Date.now(),
    visitflag: false,
  });
  try {
    await data.save();
  } catch (error) {
    res.send(error);
  }

  res.render("pages/preview", {
    uri: data.uri,
    title: req.body.title,
    password: secpass,
  });
};
module.exports = {
  dataUpload,
};
