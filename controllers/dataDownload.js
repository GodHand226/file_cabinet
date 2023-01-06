const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const crypto = require("crypto");

const secret = {
  iv: Buffer.from("b7b15651664bbec3a3f96ad8a90c05ab", "hex"),
  key: Buffer.from(
    "dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c",
    "hex"
  ),
};

const CryptoAlgorithm = "aes-256-cbc";

function encrypt(algorithm, buffer, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
}

function decrypt(algorithm, buffer, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}

function getEncryptedFilePath(filePath) {
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) + path.extname(filePath)
  );
}

function saveEncryptedFile(buffer, filePath, key, iv) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, encrypted);
}

function saveDecryptedFile(buffer, filePath, key, iv) {
  const decrypted = decrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, decrypted);
}

const dataDownload = async (req, res) => {
  uri = req.body.uri;
  console.log(uri);
  result = await DataModel.find({ uri });
  if (result.length == 0) {
    res.send("Failed");
  } else if (req.body.file) {
    saveDecryptedFile(
      fs.readFileSync("uploads/" + result[0].filename),
      path.join("downloads/", result[0].filename),
      secret.key,
      secret.iv
    );
    res.download("downloads/" + result[0].filename, result[0].filename);
  }
  if (result[0].burnflag == true) {
    result[0].delete();
  }
};
module.exports = {
  dataDownload,
};
