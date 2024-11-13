const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { itemsPerPage } = require("../config/variables");
const { Op } = require("sequelize");
const { isDeleted } = require("./commonDatabaseFields");

class Service {
  constructor(model) {
    this.model = model;
  }

  async getAll(query) {
    let {
      currentPage = 1,
      resultsPerPage = itemsPerPage,
      sortField = "createdAt",
      sortOrder = "desc",
      filters,
      search,
      populate,
      dropdown = "false",
    } = query;

    const offset = (currentPage - 1) * resultsPerPage;
    const limit = parseInt(resultsPerPage);
    const order = [[sortField, sortOrder.toUpperCase()]];

    const where = { isDeleted: false };

    if (Array.isArray(filters)) {
      filters.forEach((filterObj) => {
        if (filterObj.field && filterObj.value) {
          where[filterObj.field] = filterObj.value;
        }
      });
    }

    if (search && search.length > 0) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (dropdown === "false") {
      const options = { where, order, offset, limit };
      console.log(populate);

      if (populate && Array.isArray(populate)) {
        options.include = populate
          .map((populateItem) => {
            if (typeof populateItem === "object" && populateItem.model) {
              return {
                model: populateItem.model,
                attributes: populateItem.attributes || ["id", "name"],
                as: populateItem.as,
              };
            }
            return null;
          })
          .filter(Boolean);
      }

      console.log(options);

      const { count: totalItems, rows: items } =
        await this.model.findAndCountAll(options);

      const totalPages = Math.ceil(totalItems / resultsPerPage);

      items.forEach((item, index) => {
        item.dataValues.indexNo =
          resultsPerPage * (currentPage - 1) + index + 1;
      });

      return {
        items,
        totalPages,
        currentPage: Number(currentPage),
        totalItems,
      };
    } else {
      const options = {
        where,
        attributes: ["name", "id"],
      };

      const items = await this.model.findAll(options);

      return {
        items,
      };
    }
  }

  async getById(id, populate = []) {
    const options = {
      where: { id },
    };

    if (populate && Array.isArray(populate)) {
      options.include = populate
        .map((includeItem) => {
          if (typeof includeItem === "object" && includeItem.model) {
            return {
              model: includeItem.model,
              attributes: includeItem.attributes || ["id", "name"],
              as: includeItem.as,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    const item = await this.model.findOne(options);
    return item;
  }

  async create(data) {
    const item = await this.model.create(data);
    return item;
  }

  async update(slug, data) {
    const [rowsUpdated, [updatedItem]] = await this.model.update(data, {
      where: { slug },
      returning: true,
      individualHooks: true,
    });

    return updatedItem;
  }

  async delete(id, soft = true) {
    const item = await this.model.findByPk(id);
    if (item) {
      if (soft) {
        item.isDeleted = true;
        item.deletedAt = new Date();
        item.isActive = false;
        await item.save();
      } else {
        await item.destroy();
      }
    }
    return item;
  }
  async getBySlug(slug, populate = []) {
    const options = {
      where: { slug },
    };

    if (populate && Array.isArray(populate)) {
      options.include = populate
        .map((includeItem) => {
          if (typeof includeItem === "object" && includeItem.model) {
            return {
              model: includeItem.model,
              attributes: includeItem.attributes || ["id", "name"],
              as: includeItem.as,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    const item = await this.model.findOne(options);
    return item;
  }
}

module.exports = Service;
