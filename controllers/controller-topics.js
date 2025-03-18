const { selectTopics, insertTopic } = require("../models/model-topics");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      console.log("Found topics:", topics); // debugging
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log("Error fetching topics:", err); // debugging
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
