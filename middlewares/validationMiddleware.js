const validateRestaurant = (req, res, next) => {
  const { name, address, coordinates, rating } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!address || typeof address !== "string" || address.trim().length === 0) {
    errors.push("Address is required and must be a non-empty string");
  }

  if (!coordinates || typeof coordinates !== "object") {
    errors.push("Coordinates are required and must be an object");
  } else {
    if (
      typeof coordinates.latitude !== "number" ||
      coordinates.latitude < -90 ||
      coordinates.latitude > 90
    ) {
      errors.push("Latitude must be a number between -90 and 90");
    }
    if (
      typeof coordinates.longitude !== "number" ||
      coordinates.longitude < -180 ||
      coordinates.longitude > 180
    ) {
      errors.push("Longitude must be a number between -180 and 180");
    }
  }

  if (rating !== undefined) {
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      errors.push("Rating must be a number between 0 and 5");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

const validateDish = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (description && typeof description !== "string") {
    errors.push("Description must be a string");
  }

  if (!price || typeof price !== "number" || price < 0) {
    errors.push("Price is required and must be a positive number");
  }

  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    errors.push("Category is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

const validateReview = (req, res, next) => {
  const { userId, rating, comment } = req.body;
  const errors = [];

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    errors.push("UserId is required and must be a non-empty string");
  }

  if (
    !rating ||
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5 ||
    !Number.isInteger(rating)
  ) {
    errors.push("Rating is required and must be an integer between 1 and 5");
  }

  if (comment && typeof comment !== "string") {
    errors.push("Comment must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

const validateSearchQuery = (req, res, next) => {
  const { q, dish } = req.query;
  const searchQuery = q || dish;

  if (
    !searchQuery ||
    typeof searchQuery !== "string" ||
    searchQuery.trim().length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Search query is required and must be a non-empty string",
      errors: ['Query parameter "q" or "dish" is required'],
    });
  }

  if (searchQuery.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Search query is too long",
      errors: ["Query must be less than 100 characters"],
    });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { limit, offset } = req.query;

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter",
        errors: ["Limit must be a number between 1 and 100"],
      });
    }
    req.query.limit = limitNum;
  } else {
    req.query.limit = 20; // Default limit
  }

  if (offset) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid offset parameter",
        errors: ["Offset must be a non-negative number"],
      });
    }
    req.query.offset = offsetNum;
  } else {
    req.query.offset = 0; // Default offset
  }

  next();
};

const validateId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
        errors: [`${paramName} is required and must be a non-empty string`],
      });
    }

    next();
  };
};

module.exports = {
  validateRestaurant,
  validateDish,
  validateReview,
  validateSearchQuery,
  validatePagination,
  validateId,
};
