const { default: mongoose } = require("mongoose");
require("dotenv").config;
const connection = async () => {
  try {
    const options = {
      dbName: "TShare",
    };
    await mongoose.connect(process.env.DB_HOST, options);
  } catch (error) {
    console.log("ERRROR:>>>>", error);
  }
};
module.exports = connection;
