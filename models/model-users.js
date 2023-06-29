const db = require('../db/connection');

exports.selectUsers = () => {

    const query = 'SELECT * FROM users'

    return db.query(`${query};`).then(({rows}) => {
        return rows;
    })
}
