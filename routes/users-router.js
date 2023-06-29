const { getUsers } = require('../controllers/controller-users');

const userRouter = require('express').Router();

userRouter.get('/', getUsers);

module.exports = userRouter;
