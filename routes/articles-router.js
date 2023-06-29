const { getArticles, getArticle, postCommentOnArticle, patchArticle, getCommentsByArticleId } = require('../controllers/controller-articles');

const articleRouter = require('express').Router();

articleRouter.get('/', getArticles);

articleRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articleRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentOnArticle)

module.exports = articleRouter;
