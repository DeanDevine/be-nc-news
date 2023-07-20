const { getCommentsByAuthor } = require('../controllers/controller-comments');
const { getUsers, getUser } = require('../controllers/controller-users');

const userRouter = require('express').Router();

userRouter.get('/', getUsers);

userRouter.get('/:username', getUser);

userRouter.get('/:username/comments', getCommentsByAuthor)

module.exports = userRouter;
