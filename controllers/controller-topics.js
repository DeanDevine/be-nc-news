const { selectTopics } = require("../models/model-topics")

exports.getTopics = (req, res, next) => {

    const {sort_by} = req.query

    selectTopics(sort_by).then((topics) => {
    res.status(200).send({topics})

}).catch((err) => {
    console.log(err)
    next(err)
})

}
