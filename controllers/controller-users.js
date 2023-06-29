const { selectUsers, selectUser } = require("../models/model-users");

exports.getUsers = (req, res, next) => {

    selectUsers().then((users) => {
    res.status(200).send({users})

})
.catch(next);
}

exports.getUser = (req, res, next) => {

    const { username } = req.params

    return selectUser(username).then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}
