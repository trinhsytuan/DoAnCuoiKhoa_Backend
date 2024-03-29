const express = require("express");
const { getComment, createComment, updateComment, deleteComment } = require("./commentController");
const router = express.Router();
router.get("/:id", getComment);
router.post("/", createComment);
router.put("/", updateComment);
router.delete("/:id", deleteComment);
module.exports = router;
