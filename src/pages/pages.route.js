
const express = require('express');
const pageRouter= express.Router();
const pageController = require("./pages.controller");


pageRouter.get("/pages",pageController.getAll);
pageRouter.get("/pages/:id",pageController.getById);
pageRouter.post("/page",pageController.create);
pageRouter.put("/pages/:id",pageController.update);
pageRouter.delete("/pages/:id",pageController.delete);

module.exports = pageRouter;


