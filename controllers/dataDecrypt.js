const { UserInfo } = require("git");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const crypto = require("crypto");
const { secret_key } = require("../constant");
const DataModel = require("../models/uploaddata");

const sec = secret_key;
//Secret Key used in File Decrypt
const secret = {
  iv: Buffer.from("b7b15651664bbec3a3f96ad8a90c05ab", "hex"),
  key: Buffer.from(
    "dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c",
    "hex"
  ),
};

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

const dataDecrypt = async (req, res) => {
  uri = req.body.uri;
  //hash is Once hased string
  const hash = crypto
    .createHash("sha256", sec)
    .update(req.body.password)
    .digest("hex");
  //secpass is Twice hased string
  const secpass = crypto.createHash("sha256", sec).update(hash).digest("hex");

  result = await DataModel.find({ uri });

  if (result.length == 0) {
    //Display 'Expired' message
    res.render("pages/expired");
  } else if (secpass == result[0].password) {
    if (result[0].filename) {
      //if password is correct and file exists, decrypt file and save it to 'downloads' folder in server
      saveDecryptedFile(
        fs.readFileSync("uploads/" + result[0].filename),
        path.join("downloads/", result[0].filename),
        secret.key,
        secret.iv
      );
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
