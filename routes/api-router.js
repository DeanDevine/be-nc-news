const { getApi } = require('../controllers/controller-api');
const articleRouter = require('./articles-router');

const apiRouter = require('express').Router();
const topicRouter = require('./topics-router');
const userRouter = require('./users-router');
const commentRouter = require('./comments-router')

apiRouter.get('/', getApi)
apiRouter.use('/topics', topicRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/comments', commentRouter)

module.exports = apiRouter;
