const db = require('../db/connection')

exports.removeComment = (comment_id) => {

    return db
    .query(`SELECT * FROM comments
    WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
    }).then(() => {
        return db.query(`DELETE FROM comments
        WHERE comment_id = $1`, [comment_id])
    })

}
