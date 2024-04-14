const express = require('express');
const { addPost, getKeyLivestream, getPostByCategory, getLivestream, deletePost, editPost } = require('./postController');

const router = express.Router();


router.post('/', addPost);
router.post('/getKeyLivestream', getKeyLivestream);
router.get('/getPostByCategory/:id', getPostByCategory);
router.get('/getLivestream/:id', getLivestream);
router.delete("/:id", deletePost);
router.put("/:id", editPost);
module.exports = router;