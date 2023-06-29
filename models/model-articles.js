const db = require('../db/connection')

exports.selectArticles = () => {

    let query = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic,
    articles.created_at,
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id) 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`

    return db.query(`${query};`).then(({rows}) => {
        return rows;
    })
}

exports.selectArticle = (article_id) => {

    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return rows[0];
    })
}

exports.selectCommentsByArticleId = (article_id) => {

    return db
    .query(`SELECT 
    comment_id, 
    votes, 
    created_at, 
    author, 
    body, 
    article_id 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at ASC`, [article_id])
    .then((result) => {
        if (!result.rows.length) {
            return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]) } else return result;
        }).then(({rows}) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'Not Found' })
            } else if (!rows[0].comment_id) {
                return [];
            }
            return rows;
        })
}

exports.insertCommentIntoArticle = (article_id, author, body) => {

    if (!author) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    if (!body) {
        return Promise.reject({ status: 400, msg: "Bad Request"})
    }

    return db
    .query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;', [article_id, author, body])
    .then(({rows}) => {
        return rows[0];
    })

}

exports.updateArticleVotes = (article_id, inc_votes) => {

    if (isNaN(inc_votes) || !inc_votes) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    let query = `UPDATE articles
    SET votes = votes + ${inc_votes}
    WHERE article_id = $1 RETURNING *;`

    return db
    .query(query, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return rows[0];
    })

}
