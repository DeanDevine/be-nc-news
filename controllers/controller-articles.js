const { selectArticles, selectArticle, selectCommentsByArticleId, insertCommentIntoArticle, updateArticleVotes, insertArticle, removeArticle } = require("../models/model-articles");

exports.getArticles = (req, res, next) => {

    const { topic, sort_by, order, limit, p, total_count } = req.query;

    selectArticles(topic, sort_by, order, limit, p, total_count).then((articles) => {
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
    const { limit, p } = req.query

    return selectCommentsByArticleId(article_id, limit, p).then((comments) => {
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

exports.postArticle = (req, res, next) => {

    const { author, title, body, topic, article_img_url } = req.body;

    insertArticle(author, title, body, topic, article_img_url).then((article) => {
        res.status(201).send({ article })
    })
    .catch(next)
}

exports.deleteArticle = (req, res, next) => {

    const { article_id } = req.params;

    removeArticle(article_id).then(() => {
        res.status(204).send()
    })
    .catch(next)

}
