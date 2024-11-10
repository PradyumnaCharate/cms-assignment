// Middleware function to set the 'createdBy' or 'updatedBy' field in the request body
const createdUpdatedBy = (action = "create") => {
  return async (req, res, next) => {
    console.log("dsds"); // Debug log to indicate the middleware is being executed

    // Check the action type to determine which field to set
    if (action === "create") {
      req.body.createdBy = req.userId; // Set the createdBy field to the user's ID for creation
    } else if (action === "update") {
      req.body.updatedBy = req.userId; // Set the updatedBy field to the user's ID for updates
    }

    next(); // Continue processing the request to the next middleware or route handler
  };
};

// Export the middleware function for use in other parts of the application
module.exports = createdUpdatedBy;
