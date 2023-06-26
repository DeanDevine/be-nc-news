const { selectTopics } = require("../models/model-topics")

exports.getTopics = (_, res) => {

selectTopics().then((topics) => {
    res.status(200).send({topics})
})

}
