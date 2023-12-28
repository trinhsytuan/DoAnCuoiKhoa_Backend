const connection = require("./src/config/database");
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
var cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "*" }));
app.use("/api/static", express.static(path.join(__dirname, "uploads")));
const mainRouter = require("./src/router/mainRouter");
app.use("/", mainRouter);
async function main() {
  try {
    await connection();
    app.listen(process.env.LISTEN_PORT, () => {
      console.log("Server running port:" + process.env.LISTEN_PORT);
    });
  } catch (error) {
    console.log(">>>> Error Connect to DB:", error);
    console.log("Server Error, please contact TServices");
    process.exit();
  }
}
main();
