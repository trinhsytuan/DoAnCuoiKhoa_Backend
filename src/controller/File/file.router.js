require("dotenv").config();
const express = require("express");
const { checkToken } = require("../../utils/utils");
const {
  downloadInFile,
  createNewFile,
  shareFile,
  deleteFile,
  editFile,
  findFileByCategory,
  playVideoFile,
  uploadImage,
  removeImage,
} = require("./file.controller");
const { imageUpload } = require("../../utils/uploadImage");

const router = express.Router();
router.get("/getAll", checkToken, findFileByCategory);
router.post("/upload", checkToken, createNewFile);
router.get("/download/:id", checkToken, downloadInFile);
router.put("/shareFile/:id", checkToken, shareFile);
router.delete("/deleteFile/:id", checkToken, deleteFile);
router.put("/update/:id", checkToken, editFile);
router.get("/playVideo/:id", checkToken, playVideoFile);
router.post("/uploadImage", checkToken, imageUpload.single("image"), uploadImage);
router.delete("/removeImage/:id", checkToken, removeImage);
module.exports = router;
