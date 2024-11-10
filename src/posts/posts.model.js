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

class Post extends Model {}
Post.init(
  {
    id: id(),
    title: name("Post", true),
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    slug: slug("Post"),
    content: content(),
    summary: description(false),
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    publishedAt: {
      type: DataTypes.DATE,
    },
    isActive: isActive,
    isDeleted: isDeleted,
    deletedAt: dateType("deleted At", false),
  },
  {
    sequelize: db,
    modelName: "Post",
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

Post.beforeValidate(async (post, options) => {
  if (!post.slug) {
    let baseSlug = generateSlug(post.title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (
      await Post.findOne({ where: { slug: uniqueSlug, isDeleted: false } })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    post.slug = uniqueSlug;
  }
});

module.exports = Post;
