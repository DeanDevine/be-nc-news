const { selectUsers } = require("../models/model-users");

exports.getUsers = (req, res, next) => {

    selectUsers().then((users) => {
    res.status(200).send({users})

})
.catch(next);
}
