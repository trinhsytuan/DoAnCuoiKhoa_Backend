require("dotenv").config();
const express = require("express");
const router = express.Router();
const userRouter = require('../controller/User/userRouter')
router.use("/user", userRouter);
module.exports = router;
