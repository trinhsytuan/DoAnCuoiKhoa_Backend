require("dotenv").config();
const express = require("express");
const { checkToken } = require("../../utils/utils");
const { insertOneCategory } = require("./categoryController");
const router = express.Router();
router.post("/create", insertOneCategory);
module.exports = router;
