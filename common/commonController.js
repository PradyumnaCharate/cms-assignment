const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const responseHandler = require("../utils/responseHandler");

class Controller {
  constructor(service) {
    this.service = service;
  }

  create = catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const newItem = await this.service.create(req.body);
    new responseHandler(newItem, "Item created successfully", 201).sendResponse(
      res
    );
  });

  getAll = catchAsyncError(async (req, res, next) => {
    const data = await this.service.getAll(req.query);
    if (data.items.length === 0) {
      return next(new ErrorHandler("Items not found", 404));
    }
    new responseHandler(data, "Items fetched successfully", 200).sendResponse(
      res
    );
  });

  getByOrg = catchAsyncError(async (req, res, next) => {
    req.query.filters = [{ field: "organization", value: req.params.id }];
    const data = await this.service.getAll(req.query);
    if (data.items.length === 0) {
      return next(new ErrorHandler("No Items added in this organization", 404));
    }
    new responseHandler(data, "Items fetched Successfully!", 200).sendResponse(
      res
    );
  });

  getById = catchAsyncError(async (req, res, next) => {
    const item = await this.service.getById(req.params.id);
    if (!item) {
      return next(new ErrorHandler("Item not found", 404));
    }
    new responseHandler(item, "Item fetched successfully", 200).sendResponse(
      res
    );
  });
  getBySlug = catchAsyncError(async (req, res, next) => {
    const item = await this.service.getBySlug(req.params.slug);
    if (!item) {
      return next(new ErrorHandler("Item not found", 404));
    }
    new responseHandler(item, "Item fetched successfully", 200).sendResponse(
      res
    );
  });

  update = catchAsyncError(async (req, res, next) => {
    const { slug } = req.params;
    if (req.body.isDeleted) {
      return next(new ErrorHandler("Operation not allowed", 405));
    }
    const updatedItem = await this.service.update(slug, req.body);
    new responseHandler(
      updatedItem,
      "Item updated successfully",
      200
    ).sendResponse(res);
  });

  delete = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const deletedItem = await this.service.delete(req.params.id);
    if (!deletedItem) {
      return next(new ErrorHandler("Item not found", 404));
    }
    new responseHandler(
      deletedItem,
      "Item deleted successfully",
      200
    ).sendResponse(res);
  });

  getByOrg = catchAsyncError(async (req, res, next) => {
    req.query.filters = [{ field: "organizationId", value: req.params.id }];
    const items = await this.service.getAll(req.query);
    if (!items) {
      return next(
        new ErrorHandler("No Items added for this organization", 404)
      );
    }
    new responseHandler(items, "Fetched Successfully!", 200).sendResponse(res);
  });

  getBySite = catchAsyncError(async (req, res, next) => {
    req.query.filters = [{ field: "siteId", value: req.params.id }];
    const items = await this.service.getAll(req.query);
    if (!items) {
      return next(new ErrorHandler("No Items added for this site", 404));
    }
    new responseHandler(items, "Fetched Successfully!", 200).sendResponse(res);
  });
}

module.exports = Controller;
