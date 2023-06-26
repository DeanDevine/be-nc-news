const express = require('express');
const { getTopics } = require('./controllers/controller-topics');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

const app = express();

app.use(express.json())

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
