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

exports.updateCommentVotes = (comment_id, inc_votes) => {

    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    let query = `UPDATE comments
    SET votes = votes + ${inc_votes}
    WHERE comment_id = $1 RETURNING *;`

    return db
    .query(query, [comment_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return rows[0];
    })

}

exports.selectCommentsByAuthor = (author) => {
  let query = `SELECT 
    comment_id, 
    votes, 
    created_at, 
    author, 
    body, 
    article_id 
    FROM comments 
    WHERE author = $1
    ORDER BY created_at DESC `;

  return db
    .query(`${query};`, [author])
    .then((result) => {
      if (!result.rows.length) {
        return db.query("SELECT * FROM users WHERE username = $1;", [
          author,
        ]);
      } else return result;
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else if (!rows[0].comment_id) {
        return [];
      }
      return rows;
    });
};
