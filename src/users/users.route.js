const express = require("express");
const userRouter = express.Router();
const userController = require("./users.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
  priorityGetFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

userRouter.get(
  "/users",
  authentication,
  authorization(PermissionCodes.READ_USER_PERMISSION),

  userController.getAll
);

userRouter.get(
  "/users/:id",
  authentication,
  authorization(PermissionCodes.READ_USER_PERMISSION),

  userController.getById
);
userRouter.post(
  "/user",
  authentication,
  authorization(PermissionCodes.CREATE_USER_PERMISSION),
  createdUpdatedBy("create"),
  userController.create
);
userRouter.put(
  "/users/:id",

  userController.update
);
userRouter.delete(
  "/users/:id",
  authentication,
  authorization(PermissionCodes.DELETE_USER_PERMISSION),
  userController.delete
);
userRouter.post("/users/login", userController.login);
userRouter.post("/users/refresh", userController.getRefreshToken);
userRouter.post("/admin/images", userController.uploadMultipleImages);
userRouter.post("/admin/image", userController.uploadSingleImage);
userRouter.post("/admin/videos", userController.uploadMultipleVideos);
userRouter.post("/admin/images", userController.uploadSingleVideo);
userRouter.post("/admin/documents", userController.uploadMultipleDocuments);
userRouter.post("/admin/document", userController.uploadSingleDocument);

module.exports = userRouter;
