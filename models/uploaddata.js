const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.DB_URL;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

connection.on("error", (err) => {
  console.log(err);
});

const schema = new mongoose.Schema({
  uri: String,
  title: String,
  password: String,
  filename: [String],
  originalname: [String],
  uploaddate: Date,
  expire: String,
  burnflag: Boolean,
  visitflag: Boolean,
});

module.exports = mongoose.model("dataStore", schema);
