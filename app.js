const express = require('express');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

const apiRouter = require('./routes/api-router');

const app = express();

app.use(express.json())

app.use('/api', apiRouter);

app.use('/api/topics', apiRouter);

app.use('/api/articles', apiRouter);

app.use('/api/users', apiRouter)

app.use('/api/comments', apiRouter)

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found' })
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
