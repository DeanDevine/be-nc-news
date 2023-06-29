const { removeComment, updateCommentVotes } = require("../models/model-comments");

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
