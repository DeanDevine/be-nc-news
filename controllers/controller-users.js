const {
  selectUsers,
  selectUser,
  insertUser,
  updateUser,
} = require("../models/model-users");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  return selectUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;

  insertUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.patchUser = (req, res, next) => {
  const { username } = req.params;
  const { name, avatar_url } = req.body;

  updateUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
      console.log(user)
    })
    .catch(next);
};
