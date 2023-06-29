const { selectArticles, selectArticle, selectCommentsByArticleId, insertCommentIntoArticle, updateArticleVotes } = require("../models/model-articles");

exports.getArticles = (req, res, next) => {

    const { topic, sort_by, order } = req.query;

    selectArticles(topic, sort_by, order).then((articles) => {
    res.status(200).send({articles})

})
.catch(next);
}

exports.getArticle = (req, res, next) => {

    const { article_id } = req.params

    return selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
   
    const { article_id } = req.params

    return selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentOnArticle = (req, res, next) => {

    const { article_id } = req.params
    const author = req.body.username
    const { body } = req.body
    
    insertCommentIntoArticle(article_id, author, body).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) => {

    const { article_id } = req.params
    const { inc_votes } = req.body

    updateArticleVotes(article_id, inc_votes).then((article) => {
        res.status(201).send({ article })
    })
    .catch(next)
}
