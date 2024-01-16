require("dotenv").config();
const express = require("express");
const {checkToken} = require("../../utils/utils");
const {insertOneCategory, deleteCategory, editCategory} = require("./categoryController");
const router = express.Router();
router.post("/create", insertOneCategory);
router.delete("/delete", deleteCategory);
router.put("/update/:id", editCategory);
module.exports = router;
