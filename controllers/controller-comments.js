const { removeComment, updateCommentVotes, selectCommentsByAuthor } = require("../models/model-comments");

exports.deleteComment = (req, res, next) => {

    const { comment_id } = req.params;

    removeComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next) 

}

exports.patchComment = (req, res, next) => {

    const { comment_id } = req.params
    const { inc_votes } = req.body

    updateCommentVotes(comment_id, inc_votes).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.getCommentsByAuthor = (req, res, next) => {
  const { username } = req.params;

  return selectCommentsByAuthor(username)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
