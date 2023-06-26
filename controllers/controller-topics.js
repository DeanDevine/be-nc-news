const { selectTopics } = require("../models/model-topics")

exports.getTopics = (req, res) => {

    selectTopics().then((topics) => {
    res.status(200).send({topics})

}).catch((err) => {
    console.log(err)
})

}
