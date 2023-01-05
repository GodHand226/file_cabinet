const { UserInfo } = require("git");

const DataModel = require("../models/uploaddata");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function RandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const dataUpload = async (req, res) => {
  const data = new DataModel({
    uri: RandomString(24),
    title: req.body.title,
    password: req.body.password,
    filename: req.file ? req.file.filename : "",
    expire: req.body.expire,
    burnflag: req.body.burnflag,
    uploaddate: Date.now(),
  });
  try {
    await data.save();
  } catch (error) {
    res.send(error);
  }
  res.render("pages/preview", {
    uri: data.uri,
    title: req.body.title,
    password: req.body.password,
    filename: req.file ? req.file.filename : "",
  });
};
module.exports = {
  dataUpload,
};
