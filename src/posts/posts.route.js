const express = require("express");
const postRouter = express.Router();
const postController = require("./posts.controller");

postRouter.get("/posts", postController.getAll);
postRouter.get("/posts/:slug", postController.getBySlug);
postRouter.post("/post", postController.create);
postRouter.put("/posts/:slug", postController.update);
postRouter.delete("/posts/:id", postController.delete);

module.exports = postRouter;
