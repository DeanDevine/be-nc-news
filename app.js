const express = require('express');
const { getTopics } = require('./controllers/controller-topics');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');
const { getApi } = require('./controllers/controller-api');
const { getArticle, getArticles, getCommentsByArticleId, postCommentOnArticle, patchArticle } = require('./controllers/controller-articles');
const { deleteComment } = require('./controllers/controller-comments');
const { getUsers } = require('./controllers/controller-users');

const app = express();

app.use(express.json())

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticle);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentOnArticle)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
