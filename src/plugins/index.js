
const Plugin = require('./plugins.model');
const pluginController = require('./plugins.controller');
const pluginRouter = require('./plugins.route');
const PluginService = require("./plugins.service")

module.exports = {
  Plugin,
  pluginController,
  pluginRouter,
  PluginService
};
