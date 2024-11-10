const mongoose = require("mongoose");

function isValidObjectIdMiddleware(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Item not found", 404));
  }

  next();
}

module.exports = isValidObjectIdMiddleware;
