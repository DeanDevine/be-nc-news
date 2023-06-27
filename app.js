const express = require('express');
const { getTopics } = require('./controllers/controller-topics');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');
const { getApi } = require('./controllers/controller-api');
const { getArticle, getArticles } = require('./controllers/controller-articles');

const app = express();

app.use(express.json())

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticle);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
