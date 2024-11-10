
const Page = require('./pages.model');
const pageController = require('./pages.controller');
const pageRouter = require('./pages.route');
const PageService = require("./pages.service")

module.exports = {
  Page,
  pageController,
  pageRouter,
  PageService
};
