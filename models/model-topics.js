const db = require('../db/connection');

exports.selectTopics = () => {

    const query = 'SELECT * FROM topics '

    return db.query(`${query};`).then(({rows}) => {
        return rows;
    })
}