const db = require('../db/connection');

exports.selectTopics = (sort_by) => {

    const query = 'SELECT * FROM topics '

    if (sort_by) {
        query += `ORDER BY ${sort_by}`
    }

    return db.query(`${query};`).then(({rows}) => {
        console.log(query)
        console.log(rows)
        return rows;
    })
}
