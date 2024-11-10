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
  numberType,
} = require("../../common/commonDatabaseFields");
const { generateRandomNumber } = require("../../utils/generateRandomNumber");

class Permission extends Model {}
Permission.init(
  {
    id: id(),
    name: name("Organization", true),
    description: description(),
    code: numberType("Code", true),
    priority: numberType("Priority"),
    isActive: isActive,
    isDeleted: isDeleted,
    pgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Permissiongroups", // Table name
        key: "id",
      },
      onDelete: "CASCADE",
    },

    // createdByUserId: reference("User"),
    // updatedByUserId: reference("User"),
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Permission",
    hooks: {
      beforeValidate: (permission) => {
        if (!permission.code) {
          permission.code = generateRandomNumber(4);
        }
      },
    },
    timestamps: true,
    ...getDefaultAndCustomScopes(),
    indexes: [
      {
        unique: true,
        fields: ["code"],
        where: {
          isDeleted: false,
        },
      },
    ],
  }
);

module.exports = Permission;
