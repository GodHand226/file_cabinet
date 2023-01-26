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
    }
  }
};
module.exports = {
  dataMain,
};
