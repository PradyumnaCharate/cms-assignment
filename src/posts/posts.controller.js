const Post = require("./posts.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const PostService = require("./posts.service");
const postService = new PostService(Post);

class postController extends Controller {
  constructor(service) {
    super(service);
  }
}

module.exports = new postController(postService);
