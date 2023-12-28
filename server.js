const connection = require("./src/config/database");
require("dotenv").config();
const express = require("express");
const app = express();
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