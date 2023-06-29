const { getArticles, getArticle, postCommentOnArticle, patchArticle, getCommentsByArticleId, postArticle } = require('../controllers/controller-articles');

const articleRouter = require('express').Router();

articleRouter
.route('/')
.get(getArticles)
.post(postArticle)

articleRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articleRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentOnArticle)

module.exports = articleRouter;
