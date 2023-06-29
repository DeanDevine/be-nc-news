const db = require('../db/connection');

exports.selectUsers = () => {

    const query = 'SELECT * FROM users'

    return db.query(`${query};`).then(({rows}) => {
        return rows;
    })
}

exports.selectUser = (username) => {

    return db
    .query(`SELECT username, 
    name, 
    avatar_url 
    FROM users  
    WHERE username = $1;`, [username])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return rows[0];
    })
}
