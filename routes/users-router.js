const { getCommentsByAuthor } = require("../controllers/controller-comments");
const {
  getUsers,
  getUser,
  postUser,
  patchUser,
} = require("../controllers/controller-users");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);

userRouter.route("/:username").get(getUser).patch(patchUser);

userRouter.get("/:username/comments", getCommentsByAuthor);

module.exports = userRouter;
