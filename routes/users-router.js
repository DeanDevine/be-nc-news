const { getCommentsByAuthor } = require("../controllers/controller-comments");
const {
  getUsers,
  getUser,
  postUser,
} = require("../controllers/controller-users");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);

userRouter.get("/:username", getUser);

userRouter.get("/:username/comments", getCommentsByAuthor);

module.exports = userRouter;
