const db = require('../db/connection');

exports.selectTopics = () => {

    const query = 'SELECT * FROM topics '

    return db.query(`${query};`).then(({rows}) => {
        return rows;
    })
}

exports.insertTopic = (slug, description) => {

    if (!slug || !description) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    return db
    .query(`INSERT INTO topics (slug, description) 
    VALUES ($1, $2) 
    RETURNING *;`, [slug, description])
    .then(({rows}) => {
        return rows[0]

    })
}
