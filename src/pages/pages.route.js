const express = require("express");
const pageRouter = express.Router();
const pageController = require("./pages.controller");

pageRouter.get("/pages", pageController.getAll);
pageRouter.get("/pages/:slug", pageController.getBySlug);
pageRouter.post("/page", pageController.create);
pageRouter.put("/pages/:slug", pageController.update);
pageRouter.delete("/pages/:id", pageController.delete);

module.exports = pageRouter;
