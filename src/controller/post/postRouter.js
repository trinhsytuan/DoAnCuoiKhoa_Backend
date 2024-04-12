const express = require('express');
const { addPost, getKeyLivestream, getPostByCategory, getLivestream } = require('./postController');

const router = express.Router();


router.post('/', addPost);
router.post('/getKeyLivestream', getKeyLivestream);
router.get('/getPostByCategory/:id', getPostByCategory);
router.get('/getLivestream/:id', getLivestream);
module.exports = router;