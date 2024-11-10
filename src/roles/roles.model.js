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
  booleanType,
  numberType,
} = require("../../common/commonDatabaseFields");

class Role extends Model {}
Role.init(
  {
    id: id(),
    name: name("Role", true),
    description: description(),
    priority: numberType("Priority"),
    isOutOfBox: booleanType,
    isActive: isActive,
    isDeleted: isDeleted,
    // createdByUserId: reference("User"),
    // updatedByUserId: reference("User"),
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Role",
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

module.exports = Role;
