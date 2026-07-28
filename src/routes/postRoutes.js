const express = require('express');
const PostController = require('../controllers/postController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/search', PostController.searchPosts);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getPostById);

router.post('/', authenticate, PostController.createPost);

router.put('/:id', authenticate, PostController.updatePost);

router.delete('/:id', authenticate, PostController.deletePost);

module.exports = router;
