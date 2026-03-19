const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();

router.get('/search', PostController.searchPosts);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getPostById);

router.post('/', PostController.createPost);

router.put('/:id', PostController.updatePost);

router.delete('/:id', PostController.deletePost);

module.exports = router;
