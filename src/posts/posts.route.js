
const express = require('express');
const postRouter= express.Router();
const postController = require("./posts.controller");


postRouter.get("/posts",postController.getAll);
postRouter.get("/posts/:id",postController.getById);
postRouter.post("/post",postController.create);
postRouter.put("/posts/:id",postController.update);
postRouter.delete("/posts/:id",postController.delete);

module.exports = postRouter;


