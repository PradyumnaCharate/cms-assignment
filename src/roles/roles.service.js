const { Op } = require("sequelize");
const Service = require("../../common/CommonService");

class RoleService extends Service {
  constructor(model) {
    super(model);
  }

  async createRoleWithPermissions(roleData, permissionIds) {
    const role = await this.model.create(roleData);

    const rolePermissionMappings = permissionIds.map((permissionId) => ({
      roleId: role.id,
      permissionId,
    }));

    await this.rolePermissionMappingService.createMany(rolePermissionMappings);

    return role;
  }

  async removePermissionsFromRole(rolePermissionMappingIds) {
    await this.rolePermissionMappingService.destroy({
      where: {
        id: {
          [Op.in]: rolePermissionMappingIds,
        },
      },
    });
    return;
  }

  async getRolesByOrg(priority, organizationId) {
    const whereClause =
      priority > 0
        ? { priority: { [Op.gte]: priority }, organizationId }
        : { priority: { [Op.gte]: priority } };

    const roles = await this.model.findAll({
      where: whereClause,
    });

    return roles;
  }
}

module.exports = RoleService;
