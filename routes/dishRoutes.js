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

const router = express.Router({ mergeParams: true });

// Include other resource routers
const reviewRouter = require("./reviewRoutes");
router.use("/:dishId/reviews", reviewRouter);

// Global dish search route (not nested under restaurants)
router.route("/search").get(validateSearchQuery, globalSearchDishes);

// Nested dish routes (under restaurants/:restaurantId/dishes)
router
  .route("/")
  .get(validatePagination, getAllDishes)
  .post(validateDish, createDish);

router.route("/search").get(validateSearchQuery, searchDishes);

router
  .route("/category/:category")
  .get(validateId("category"), searchDishesByCategory);

router
  .route("/:dishId")
  .get(validateId("dishId"), getDish)
  .put(validateId("dishId"), validateDish, updateDish)
  .delete(validateId("dishId"), deleteDish);

module.exports = router;
