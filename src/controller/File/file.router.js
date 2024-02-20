require("dotenv").config();
const express = require("express");
const { checkToken } = require("../../utils/utils");
const {
  downloadInFile,
  createNewFile,
  shareFile,
  deleteFile,
  editFile,
} = require("./file.controller");
const { imageUpload } = require("../../utils/uploadImage");

const router = express.Router();
router.post("/upload", checkToken, createNewFile);
router.get("/download/:id", checkToken, downloadInFile);
router.put("/shareFile/:id", checkToken, shareFile);
router.delete("/deleteFile/:id", checkToken, deleteFile);
router.put("/update/:id", checkToken, editFile);
module.exports = router;
