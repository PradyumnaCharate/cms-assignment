const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const {
  userService,
  rolepermissionsmappingService,
} = require("../services/dependencyResolver");
const { UUID } = require("sequelize");

const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(
        new ErrorHandler(
          "Unauthorized. Please send token in request header",
          401
        )
      );
    }

    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const user = await userService.getById(userId);
    if (!user) {
      return next(
        new ErrorHandler("Unauthorized. Please send a valid token", 401)
      );
    }

    req.userId = userId;
    req.roleId = user.roleId;
    req.orgId = user.organizationId;
    req.site = user?.siteId;
    next();
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler("Unauthorized. Please send a valid token", 401)
    );
  }
};

const authorization = (code = "08dd81a2-bc62-45a5-8153-1071e80ea56b") => {
  return async (req, res, next) => {
    try {
      const result = await rolepermissionsmappingService.findByRoleAndCode(
        req.roleId,
        code
      );
      console.log(result, "result");
      if (!result) {
        return next(
          new ErrorHandler(
            "Unauthorized. You do not have sufficient permissions to access this resource",
            401
          )
        );
      }
      req.priority = result.priority;
      next();
    } catch (error) {
      return next(
        new ErrorHandler(
          "Unauthorized. You do not have sufficient permissions to access this resource",
          401
        )
      );
    }
  };
};

const levelOnePriorityFilter = async (req, res, next) => {
  if (req.priority > 0 && req.params.id !== req.orgId.toString()) {
    return next(
      new ErrorHandler(
        "Unauthorized. You do not have sufficient permissions to access this resource",
        401
      )
    );
  }
  next();
};

const priorityGetFilter = (self = false) => {
  return async (req, res, next) => {
    if (req.priority > 0 && !self) {
      req.query.filters = [{ field: "organizationId", value: req.orgId }];
    } else if (req.priority > 0 && self) {
      req.query.filters = [{ field: "_id", value: req.orgId }];
    }
    next();
  };
};

const priorityPostFilter = (self = false) => {
  return async (req, res, next) => {
    if (!self) {
      req.query.filters = [{ field: "organizationId", value: req.orgId }];
    } else {
      req.query.filters = [{ field: "_id", value: req.orgId }];
    }
    next();
  };
};

module.exports = {
  authentication,
  authorization,
  levelOnePriorityFilter,
  priorityGetFilter,
};
