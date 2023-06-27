const { selectArticles } = require("../models/model-articles");
const { selectArticle } = require("../models/model-articles")

exports.getArticles = (req, res, next) => {

    selectArticles().then((articles) => {
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
