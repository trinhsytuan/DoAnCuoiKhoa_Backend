require("dotenv").config();
const express = require("express");
const {
  signUp,
  signIn,
  getMyInfo,
  updateMyInfo,
  changeNewPassword,
} = require("./userController");
const { checkToken } = require("../../utils/utils");
const { imageUpload } = require("../../utils/uploadImage");
const router = express.Router();
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/getMyInfo", checkToken, getMyInfo);
router.put(
  "/updateMyInfo",
  checkToken,
  imageUpload.single("avatar"),
  updateMyInfo
);
router.put("/changePassword", checkToken, changeNewPassword);
module.exports = router;
