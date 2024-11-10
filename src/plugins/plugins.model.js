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
  password,
  countryCode,
  slug,
  content,
} = require("../../common/commonDatabaseFields");
const generateSlug = require("../../utils/generateSlug");

class Plugin extends Model {}
Plugin.init(
  {
    id: id(),
    name: name("Plugin", true),
    description: description(false),
    settings: {
      type: DataTypes.JSONB,
    },
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Plugin",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
        where: {
          isDeleted: false,
        },
      },
      {
        unique: true,
        fields: ["title"],
        where: {
          isDeleted: false,
        },
      },
    ],
  }
);

module.exports = Plugin;
