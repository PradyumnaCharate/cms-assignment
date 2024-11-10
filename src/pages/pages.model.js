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

class Page extends Model {}
Page.init(
  {
    id: id(),
    title: name("Page", true),
    slug: slug("Page"),
    content: content(),
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    publishedAt: {
      type: DataTypes.DATE,
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Page",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["slug"],
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

Page.beforeValidate(async (page, options) => {
  if (!page.slug) {
    let baseSlug = generateSlug(page.title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (
      await Page.findOne({ where: { slug: uniqueSlug, isDeleted: false } })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    page.slug = uniqueSlug;
  }
});

module.exports = Page;
