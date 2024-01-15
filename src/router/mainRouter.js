require("dotenv").config();
const express = require("express");
const router = express.Router();
const userRouter = require("../controller/User/userRouter");
const categoryRouter = require("../controller/category/categoryRouter");
const { checkToken } = require("../utils/utils");
router.use("/user", userRouter);
router.use("/category", checkToken, categoryRouter);
module.exports = router;
