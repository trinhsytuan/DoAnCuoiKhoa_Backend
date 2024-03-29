require("dotenv").config();
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { imageUpload } = require("../../utils/uploadImage");
const { createGroup, leaveGroup } = require("./groupController");
const router = express.Router();
router.post("/create", createGroup);
router.put("/leave/:id", leaveGroup);
router.put("/kick/:id", leaveGroup);
module.exports = router;
