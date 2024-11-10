const Plugin = require("./plugins.model");
const catchAsyncError = require("../../utils/catchAsyncError");
const ErrorHandler = require("../../utils/errorHandler");
const responseHandler = require("../../utils/responseHandler");
const Controller = require("../../common/commonController");
const PluginService = require("./plugins.service");
const pluginService = new PluginService(Plugin);

class pluginController extends Controller {
  constructor(service) {
    super(service);
  }
}

module.exports = new pluginController(pluginService);
