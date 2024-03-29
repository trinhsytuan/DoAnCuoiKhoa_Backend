const express = require('express');
const { addPost } = require('./postController');

const router = express.Router();


router.post('/', addPost);

module.exports = router;