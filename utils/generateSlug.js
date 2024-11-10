const generateSlug = (title, maxLength = 100) => {
  let slug = title.toLowerCase();

  slug = slug.replace(/[^a-z0-9\s\-._]/g, "");

  slug = slug.replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/, "");
  }

  return slug;
};

module.exports = generateSlug;
