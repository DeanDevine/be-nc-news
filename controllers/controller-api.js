const { selectApi } = require("../models/model-api")

exports.getApi = (req, res) => {

    selectApi().then((endpoints) => {
        res.status(200).send({endpoints})
    })

}
