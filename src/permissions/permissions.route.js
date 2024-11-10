const express = require("express");
const permissionRouter = express.Router();
const permissionController = require("./permissions.controller");
const {
  authentication,
  authorization,
  levelOnePriorityFilter,
} = require("../../middlewares/auth");
const createdUpdatedBy = require("../../middlewares/createdUpdatedBy");
const rolePermissionsMappingsController = require("../rolePermissionsMappings/rolePermissionsMappings.controller");
const { PermissionCodes } = require("../../common/codes/permissionCodes");

// Define routes for permissions and apply middlewares as needed
permissionRouter.get(
  "/permissions",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  rolePermissionsMappingsController.getMyPermissions
);

permissionRouter.get(
  "/permissions/:id",
  authentication,
  authorization(PermissionCodes.READ_ROLE_PERMISSION),
  rolePermissionsMappingsController.getRolesPermissions
);

permissionRouter.post(
  "/permission",
  // authentication,
  // createdUpdatedBy("create"),
  permissionController.create
);

permissionRouter.put(
  "/permissions/:id",
  // authentication,
  // authorization(5650), // Replace with the appropriate authorization code
  permissionController.update
);

permissionRouter.delete(
  "/permissions/:id",
  // authentication,
  // authorization(5676), // Replace with the appropriate authorization code
  permissionController.delete
);

module.exports = permissionRouter;
