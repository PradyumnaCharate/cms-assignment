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

class RolePermission extends Model {}
RolePermission.init(
  {
    id: id(),

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Roles", // table name
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permissionId: {
      type: DataTypes.INTEGER, // Assuming code is a string
      allowNull: false,
      references: {
        model: "Permissions", // table name
        key: "id", // reference to code column
      },
      onDelete: "CASCADE",
    },

    isActive: isActive,
    isDeleted: isDeleted,
    // createdByUserId: reference("User"),
    // updatedByUserId: reference("User"),
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "RolePermission",
    timestamps: true,
    ...getDefaultAndCustomScopes(),
    indexes: [
      {
        unique: true,
        fields: ["roleId", "permissionId"],
        where: {
          isDeleted: false,
        },
      },
    ],
  }
);

module.exports = RolePermission;
