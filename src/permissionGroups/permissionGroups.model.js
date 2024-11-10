const { DataTypes, Model } = require("sequelize");
const { db } = require("../../config/database");
const {
  name,
  description,
  email,
  softDelete,
  reference,
  contact,
  address,
  isDeleted,
  isActive,
  stringType,
  dateType,
  id,
  getDefaultAndCustomScopes,
} = require("../../common/commonDatabaseFields");

class PermissionGroup extends Model {}
PermissionGroup.init(
  {
    id: id(),
    name: name("Permission Group", true),
    description: description(),
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Permissiongroup",
    timestamps: true,
    ...getDefaultAndCustomScopes(),
    indexes: [
      {
        unique: true,
        fields: ["name"],
        where: {
          isDeleted: false,
        },
      },
    ],
  }
);

module.exports = PermissionGroup;
