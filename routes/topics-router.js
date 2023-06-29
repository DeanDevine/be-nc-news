const { getTopics } = require('../controllers/controller-topics');

const topicRouter = require('express').Router();

topicRouter.get('/', getTopics);

module.exports = topicRouter;
