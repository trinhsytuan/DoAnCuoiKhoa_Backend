require("dotenv").config();
const express = require("express");
const { signUp, signIn, getMyInfo } = require("./userController");
const { checkToken } = require("../../utils/utils");
const router = express.Router();
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/getMyInfo", checkToken, getMyInfo);
module.exports = router;
