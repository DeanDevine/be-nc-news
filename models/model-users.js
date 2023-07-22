const db = require("../db/connection");

exports.selectUsers = () => {
  const query = "SELECT * FROM users";

  return db.query(`${query};`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUser = (username) => {
  return db
    .query(
      `SELECT username, 
    name, 
    avatar_url 
    FROM users  
    WHERE username = $1;`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.insertUser = (username, name, avatar_url) => {
  if (!username || !name) {
    return Promise.reject({ status: 400, msg: "Username and name required" });
  }

  return db
    .query(
      "INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;",
      [username, name, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
