const { selectArticle } = require("../models/model-articles")

exports.getArticle = (req, res, next) => {

    const { article_id } = req.params

    return selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
