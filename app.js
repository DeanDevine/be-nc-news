const express = require('express');
const { getTopics } = require('./controllers/controller-topics');

const app = express();

app.use((req, res, next) => {
    next()
});

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    res.status(400).send({msg: 'Bad Request'})
   });

module.exports = app;
