require("dotenv").config();
const express = require("express");
const {checkToken} = require("../../utils/utils");
const {downloadInFile, createNewFile} = require("./file.controller");
const { imageUpload } = require("../../utils/uploadImage");

const router = express.Router();
router.post("/upload", checkToken, createNewFile);
router.get("/", downloadInFile);
module.exports = router;
