const express = require('express');
const { addPost, getKeyLivestream } = require('./postController');

const router = express.Router();


router.post('/', addPost);
router.post('/getKeyLivestream', getKeyLivestream);
module.exports = router;