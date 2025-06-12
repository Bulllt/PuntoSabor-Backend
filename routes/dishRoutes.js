const express = require("express");
const {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
  searchDishes,
  searchDishesByCategory,
  globalSearchDishes,
} = require("../controllers/dishController");
const {
  validateDish,
  validateSearchQuery,
  validatePagination,
  validateId,
} = require("../middlewares/validationMiddleware");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });
const reviewRouter = require("./reviewRoutes");
router.use("/:dishId/reviews", reviewRouter);

// (not nested under restaurants)
router.route("/search").get(validateSearchQuery, globalSearchDishes);

// (under restaurants/:restaurantId/dishes)
router
  .route("/")
  .get(validatePagination, getAllDishes)
  .post(validateDish, authenticate, isAdmin, createDish);

router.route("/search").get(validateSearchQuery, searchDishes);

router
  .route("/category/:category")
  .get(validateId("category"), searchDishesByCategory);

router
  .route("/:dishId")
  .get(validateId("dishId"), getDish)
  .put(validateId("dishId"), authenticate, isAdmin, validateDish, updateDish)
  .delete(validateId("dishId"), authenticate, isAdmin, deleteDish);

module.exports = router;
