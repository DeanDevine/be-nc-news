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

exports.insertUser = (
  username,
  name,
  avatar_url = "https://cdn-icons-png.flaticon.com/512/761/761229.png?w=740&t=st=1690055541~exp=1690056141~hmac=16e46f9df299a4b1860d80412f270e3e02e627c54b5cc26fcf16d522a2c548a3"
) => {
  if (!username || !name) {
    return Promise.reject({ status: 400, msg: "Username and name required" });
  }

  return db
    .query("SELECT username FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length) {
        return Promise.reject({ status: 400, msg: "Username already exists" });
      }
    })
    .then(() => {
      return db.query(
        "INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;",
        [username, name, avatar_url]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateUser = (
  username,
  name,
  avatar_url = "https://cdn-icons-png.flaticon.com/512/761/761229.png?w=740&t=st=1690055541~exp=1690056141~hmac=16e46f9df299a4b1860d80412f270e3e02e627c54b5cc26fcf16d522a2c548a3"
) => {
  let query = `UPDATE users
  SET name = $2, avatar_url = $3
  WHERE username = $1 RETURNING *;`;

  return db.query(query, [username, name, avatar_url]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows[0];
  });
};
