const express = require("express");

const path = require("path");
const busboy = require("connect-busboy");
const bodyParser = require("body-parser");
const { dataUpload } = require("./controllers/dataUpload");

const app = express();
//Add path for downloaded Image Preview
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
app.use("/statics", express.static(path.join(__dirname, "statics")));
app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

require("dotenv").config();
const port = process.env.PORT;

const upload = require("./routers/upload");
const main = require("./routers/main");
const decrypt = require("./routers/decrypt");
const download = require("./routers/download");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", main);
app.use("/upload", upload);
app.use("/decrypt", decrypt);
app.use("/download", download);

app.listen(port, function (error) {
  if (error) throw error;
  console.log(`Server created Successfully on ${port}`);
});
