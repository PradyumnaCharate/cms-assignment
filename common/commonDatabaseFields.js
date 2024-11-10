const { DataTypes } = require("sequelize");

exports.id = () => ({
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
});

exports.name = (name, required) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: {
    len: [2, 255],
    notNull: required ? { msg: `Please Enter ${name} Name` } : undefined,
  },
});
exports.slug = (name) => ({
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    len: [2, 255],
    notNull: { msg: `Please Enter ${name} Slug` },
  },
});
exports.content = () => ({
  type: DataTypes.JSONB,
  allowNull: false,
});
exports.status = () => ({
  type: DataTypes.ENUM("draft", "published", "archived"),
  allowNull: false,
  defaultValue: "draft",
});

exports.description = (required = true) => ({
  type: DataTypes.STRING(5000),
  allowNull: !required,
});

exports.purpose = (required = true) => ({
  type: DataTypes.STRING(5000),
  allowNull: !required,
  validate: {
    len: [0, 5000],
    notNull: required ? { msg: `Please Enter Purpose.` } : undefined,
  },
});

exports.email = (name, required = true) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: {
    notNull: required ? { msg: `Please Enter ${name} Email` } : undefined,
  },
});

exports.countryCode = (name, required) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: {
    len: [2, 4],
    notNull: required
      ? { msg: `Country Code should have between 2 and 4 characters` }
      : undefined,
  },
});

exports.contact = (name, required) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: {
    len: [9, 12],
    notEmpty: required ? { msg: `Please Enter ${name} Phone No.` } : undefined,
  },
});

exports.address = {
  line1: { type: DataTypes.STRING, allowNull: true },
  line2: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  postalCode: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  latitude: { type: DataTypes.STRING },
  longitude: { type: DataTypes.STRING },
};

exports.isDeleted = { type: DataTypes.BOOLEAN, defaultValue: false };
exports.isActive = { type: DataTypes.BOOLEAN, defaultValue: true };
exports.booleanType = { type: DataTypes.BOOLEAN, defaultValue: false };

exports.password = {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    len: [8, undefined],
    notNull: { msg: "Please Enter Password" },
  },
};

exports.image = (name, required = true) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: required
    ? { notNull: { msg: `${name} image is required` } }
    : undefined,
});

exports.designation = (required) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: {
    len: [0, 100],
    notNull: required
      ? { msg: `Designation should have between 2 and 100 characters` }
      : undefined,
  },
});

exports.dateType = (name, required = true) => ({
  type: DataTypes.DATE,
  allowNull: !required,
  validate: required
    ? { notNull: { msg: `${name} Date is required field.` } }
    : undefined,
});

exports.stringType = (name, required = true) => ({
  type: DataTypes.STRING,
  allowNull: !required,
  validate: required
    ? { notNull: { msg: `${name} is required field.` } }
    : undefined,
});

exports.textType = (name, required = true) => ({
  type: DataTypes.TEXT,
  allowNull: !required,
  validate: required
    ? { notNull: { msg: `${name} is required field.` } }
    : undefined,
});

exports.numberType = (name, required = true) => ({
  type: DataTypes.INTEGER,
  allowNull: !required,
  validate: required
    ? { notNull: { msg: `${name} is required field.` } }
    : undefined,
});
exports.getDefaultAndCustomScopes = () => {
  return {
    defaultScope: {
      where: {
        isDeleted: false,
      },
    },
    scopes: {
      withDeleted: {
        where: {},
      },
    },
  };
};
