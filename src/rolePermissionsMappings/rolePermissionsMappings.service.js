const Service = require("../../common/CommonService");
const { Op } = require("sequelize");
const { Permission, Permissiongroup } = require("../associations");
const {
  PermissionGroup,
} = require("../permissionGroups/permissionGroups.model");
const { Role } = require("../associations");

class RolepermissionsmappingService extends Service {
  constructor(model) {
    super(model);
  }

  async createMany(permissions) {
    const rolePermissionMappings = await this.model.bulkCreate(permissions);
    return rolePermissionMappings;
  }

  async deleteMany(roleId, permissions) {
    const removedPermissionMappings = await this.model.destroy({
      where: {
        roleId,
        permissionId: {
          [Op.in]: permissions,
        },
      },
    });
    return removedPermissionMappings;
  }

  async updateRolePermissions(roleId, selectedPermissions) {
    const currentRolePermissions = await this.model.findAll({
      where: { roleId },
    });

    const currentPermissionIds = currentRolePermissions.map(
      (mapping) => mapping.permissionId
    );

    const permissionsToAdd = selectedPermissions.filter(
      (permissionId) => !currentPermissionIds.includes(permissionId)
    );
    const permissionsToRemove = currentPermissionIds.filter(
      (permissionId) => !selectedPermissions.includes(permissionId)
    );

    const addedMappings = permissionsToAdd.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.createMany(addedMappings);
    await this.deleteMany(roleId, permissionsToRemove);

    return {
      addedItems: addedMappings,
      removedPermissionIds: permissionsToRemove,
    };
  }

  async findByRoleAndCode(roleId, permissionId) {
    try {
      console.log(roleId, permissionId, "dsssssssssss");
      const rolePermissionMapping = await this.model.findOne({
        where: { roleId: roleId, permissionId: permissionId },
      });

      const roleWithPriority = await Role.findByPk(roleId, {
        attributes: ["priority"],
      });
      console.log(roleWithPriority);
      return roleWithPriority;
    } catch (error) {
      console.error("Error in findByRoleAndCode:", error);
      throw error;
    }
  }

  async getMyPermissions(roleId, codesOnly = true) {
    const whereClause = { roleId };

    if (codesOnly) {
      const permissions = await this.model.findAll({
        where: whereClause,
      });
      console.log(permissions);
      const permissionIds = permissions.map(
        (permission) => permission.permissionId
      );
      return { items: permissionIds };
    } else {
      const roleWithPermissions = await Role.findByPk(roleId, {
        include: {
          model: Permission,
          as: "permissions",
          include: {
            model: Permissiongroup,
            as: "permissionGroup",
            attributes: ["id", "name"],
          },
        },
      });

      const groupedPermissions = roleWithPermissions.permissions.reduce(
        (acc, permission) => {
          const groupName = permission.permissionGroup.name;

          if (!acc[groupName]) {
            acc[groupName] = {
              name: groupName,
              permissions: [],
            };
          }

          acc[groupName].permissions.push(permission);

          return acc;
        },
        {}
      );

      return {
        items: Object.values(groupedPermissions),
        priority: roleWithPermissions?.priority,
      };
    }
  }
}

module.exports = RolepermissionsmappingService;
