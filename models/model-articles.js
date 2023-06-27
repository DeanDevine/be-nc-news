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
