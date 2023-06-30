const { getTopics, postTopic } = require('../controllers/controller-topics');

const topicRouter = require('express').Router();

topicRouter
.route('/')
.get(getTopics)
.post(postTopic)

module.exports = topicRouter;
