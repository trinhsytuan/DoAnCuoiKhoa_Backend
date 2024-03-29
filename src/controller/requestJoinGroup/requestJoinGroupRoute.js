const express = require('express');
const { getGroupById, createJoinGroup, updateStatus, deleteRequest } = require('./requestJoinGroupController');

const router = express.Router();

router.get('/:id', getGroupById);
router.post("/", createJoinGroup);
router.put("/:id", updateStatus);
router.delete("/:id", deleteRequest)

module.exports = router;