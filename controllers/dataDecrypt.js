const { UserInfo } = require("git");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const crypto = require("crypto");

const DataModel = require("../models/uploaddata");

const sec = "SecretWorld";

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

const dataDecrypt = async (req, res) => {
  uri = req.body.uri;

  const hash = crypto
    .createHash("sha256", sec)
    .update(req.body.password)
    .digest("hex");

  result = await DataModel.find({ uri });

  if (result.length == 0) {
    res.send("Expired");
  } else if (hash == result[0].password) {
    saveDecryptedFile(
      fs.readFileSync("uploads/" + result[0].filename),
      path.join("downloads/", result[0].filename),
      secret.key,
      secret.iv
    );
    console.log(result[0]);
    res.render("pages/decrypt", {
      uri: result[0].uri,
      title: result[0].title,
      filename: result[0].filename,
      expire: result[0].expire,
      burnflag: result[0].burnflag,
    });
    result[0].visitflag = true;
    result[0].save();
  } else {
    res.render("pages/password", { warntext: "exactly", uri });
  }
};
module.exports = {
  dataDecrypt,
};
