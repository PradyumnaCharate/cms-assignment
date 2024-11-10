const { DataTypes, Model } = require("sequelize");
const { db } = require("../../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
} = require("../../common/commonDatabaseFields");

class User extends Model {}
User.init(
  {
    id: id(),
    name: name("Organization", true),
    email: email("User"),
    password: password,
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "User",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
      where: {
        isDeleted: false,
      },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },

    indexes: [
      {
        unique: true,
        fields: ["email"],
        where: {
          isDeleted: false,
        },
      },
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

User.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.getJWTToken = function () {
  return jwt.sign({ userId: this.id }, process.env.JWT_SECRET);
};

User.prototype.comparePassword = async function (enteredPassword) {
  console.log(enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
