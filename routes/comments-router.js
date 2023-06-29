const { deleteComment } = require('../controllers/controller-comments');

const commentRouter = require('express').Router();

commentRouter.delete('/:comment_id', deleteComment);

module.exports = commentRouter;
