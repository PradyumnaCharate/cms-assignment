
const Post = require('./posts.model');
const postController = require('./posts.controller');
const postRouter = require('./posts.route');
const PostService = require("./posts.service")

module.exports = {
  Post,
  postController,
  postRouter,
  PostService
};
