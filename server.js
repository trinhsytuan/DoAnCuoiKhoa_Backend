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
app.use("/api/download", express.static(path.join(__dirname, "decrypt")));
const mainRouter = require("./src/router/mainRouter");
const { createLiveStream } = require("./src/livestream/livestream");
app.use("/api", mainRouter);
async function main() {
  try {
    await connection();
    app.listen(process.env.LISTEN_PORT, () => {
      console.log("Server running port:" + process.env.LISTEN_PORT);
    });
    const curentDateFolder = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
   
    const tempDir = path.join("./uploads", curentDateFolder);
    const tempDecrypt = path.join("./decrypt", curentDateFolder);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    if (!fs.existsSync(tempDecrypt)) {
      fs.mkdirSync(tempDecrypt, { recursive: true });
    }
  } catch (error) {
    console.log(">>>> Error Connect to DB:", error);
    console.log("Server Error, please contact TServices");
    process.exit();
  }
}
main();
