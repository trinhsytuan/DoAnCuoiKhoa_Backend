require("dotenv").config();
const express = require("express");
const {checkToken} = require("../../utils/utils");
const {downloadInFile} = require("./file.controller");

const router = express.Router();
router.get("/", downloadInFile);
module.exports = router;
