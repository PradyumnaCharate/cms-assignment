
const express = require('express');
const pluginRouter= express.Router();
const pluginController = require("./plugins.controller");


pluginRouter.get("/plugins",pluginController.getAll);
pluginRouter.get("/plugins/:id",pluginController.getById);
pluginRouter.post("/plugin",pluginController.create);
pluginRouter.put("/plugins/:id",pluginController.update);
pluginRouter.delete("/plugins/:id",pluginController.delete);

module.exports = pluginRouter;


