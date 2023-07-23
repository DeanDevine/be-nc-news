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
  avatar_url = "https://as1.ftcdn.net/v2/jpg/05/49/76/36/1000_F_549763670_hkKD4bQwrrxaSGwz6WjCdE0yKVBQ0G2x.jpg"
) => {
  if (!username || !name) {
    return Promise.reject({ status: 400, msg: "Username and name required" });
  }

  if (!avatar_url.trim().length) {
    avatar_url =
      "https://as1.ftcdn.net/v2/jpg/05/49/76/36/1000_F_549763670_hkKD4bQwrrxaSGwz6WjCdE0yKVBQ0G2x.jpg";
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
  avatar_url = "https://as1.ftcdn.net/v2/jpg/05/49/76/36/1000_F_549763670_hkKD4bQwrrxaSGwz6WjCdE0yKVBQ0G2x.jpg"
) => {
  if (!avatar_url.trim().length) {
    avatar_url =
      "https://as1.ftcdn.net/v2/jpg/05/49/76/36/1000_F_549763670_hkKD4bQwrrxaSGwz6WjCdE0yKVBQ0G2x.jpg";
  }

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
