const Page = require("./pages.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const PageService = require("./pages.service");
const pageService = new PageService(Page);

class pageController extends Controller {
  constructor(service) {
    super(service);
  }
}

module.exports = new pageController(pageService);
