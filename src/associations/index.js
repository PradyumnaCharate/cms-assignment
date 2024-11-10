const User = require("../users/users.model");

const Role = require("../roles/roles.model");
const Permission = require("../permissions/permissions.model");
const Rolepermissionsmapping = require("../rolePermissionsMappings/rolePermissionsMappings.model");
const Permissiongroup = require("../permissionGroups/permissionGroups.model");

Permissiongroup.hasMany(Permission, { foreignKey: "pgId", as: "permissions" });
Permission.belongsTo(Permissiongroup, {
  foreignKey: "pgId",
  as: "permissionGroup",
});
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});
Role.belongsToMany(Permission, {
  through: Rolepermissionsmapping,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});
Permission.belongsToMany(Role, {
  through: Rolepermissionsmapping,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

module.exports = {
  Permission,
  Permissiongroup,
  User,
  Rolepermissionsmapping,
  Role,
};
