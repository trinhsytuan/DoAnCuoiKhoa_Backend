require("dotenv").config();
const express = require("express");
const router = express.Router();
const userRouter = require("../controller/User/userRouter");
const categoryRouter = require("../controller/category/categoryRouter");
const fileRouter = require("../controller/File/file.router");
const groupRouter = require("../controller/group/groupRouter");
const requestJoinRouter = require("../controller/requestJoinGroup/requestJoinGroupRoute");
const postRouter = require("../controller/post/postRouter");
const commentRouter = require('../controller/comment/commentRouter');
const {checkToken} = require("../utils/utils");
router.use("/user", userRouter);
router.use("/category", checkToken, categoryRouter);
router.use("/file", fileRouter);
router.use("/group", checkToken, groupRouter);
router.use("/requestJoin",checkToken, requestJoinRouter );
router.use("/post", checkToken, postRouter);
router.use("/comment", checkToken, commentRouter)
module.exports = router;
