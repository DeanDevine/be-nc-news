const db = require('../db/connection')

exports.selectArticles = (topic, sort_by, order, limit=10, p, total_count) => {

    const validTopic = ["mitch", "cats", "paper"]

    const validSortBy = ["articles.author", "articles.title", "articles.article_id", "articles.topic", "articles.created_at", "articles.votes", "comment_count"]

    const validOrder = ["ASC", "DESC"]

    if (topic && !validTopic.includes(topic)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    if (sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    if (order && !validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    if (p && isNaN(p) || isNaN(limit)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    let query = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic,
    articles.created_at,
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count`

    if (total_count = true) {
        query += `, MAX(articles.article_id) OVER () AS total_count`
    }

    query += ` FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id `

    const queryValues = []

    if (topic) {
        query += `WHERE articles.topic = $1 `
        queryValues.push(topic)
    }

    query += `GROUP BY articles.article_id, comments.article_id `

    if (sort_by && !order) {
        query += `ORDER BY ${sort_by} ASC `
    }

    if (order && !sort_by) {
        query += `ORDER BY created_at ${order} `
    }

    if (!sort_by && !order) {
        query += `ORDER BY articles.created_at DESC `
    }

    if (sort_by && order) {
        query += `ORDER BY ${sort_by} ${order} `
    }

    if (limit && !p) {
        query += `LIMIT ${limit}`
    }

    if (limit && p) {
        query += `LIMIT ${limit} OFFSET ${p}`
    }

    return db.query(`${query};`, queryValues).then(({rows}) => {
        return rows;
    })
}

exports.selectArticle = (article_id) => {

    return db
    .query(`SELECT articles.author, 
    articles.title, 
    articles.article_id, 
    articles.body, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id) 
    WHERE article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return rows[0];
    })
}

exports.selectCommentsByArticleId = (article_id, limit=10, p) => {

    let query = `SELECT 
    comment_id, 
    votes, 
    created_at, 
    author, 
    body, 
    article_id 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at ASC `

    if (p && isNaN(p) || isNaN(limit)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    if (!p) {
        query += `LIMIT ${limit}`
    }

    if (p) {
        query += `LIMIT ${limit} OFFSET ${p}`
    }

    return db
    .query(`${query};`, [article_id])
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

    // if (isNaN(inc_votes) || !inc_votes) {
    //     return Promise.reject({ status: 400, msg: "Bad Request" })
    // }

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

exports.insertArticle = (author, title, body, topic, article_img_url="https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700") => {

    if (!author || !title || !body || !topic) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    return db
    .query(`INSERT INTO articles (author, title, body, topic, article_img_url) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;`, [author, title, body, topic, article_img_url])
    .then(({rows}) => {

        return db
        .query(`SELECT 
        articles.author, 
        articles.title, 
        articles.body, 
        articles.topic, 
        articles.article_img_url, 
        articles.article_id, 
        articles.votes, 
        articles.created_at, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments USING (article_id) 
        WHERE article_id = $1
        GROUP BY articles.article_id;`, [rows[0].article_id])
    }).then(({rows}) => {
        return rows[0]
    })

}

exports.removeArticle = (article_id) => {

    return db
    .query(`SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
    }).then(() => {
        return db.query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
    }).then(() => {
        return db.query(`DELETE FROM articles
        WHERE article_id = $1`, [article_id])
    })

}
