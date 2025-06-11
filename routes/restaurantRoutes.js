const express = require("express");
const {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  searchRestaurantsByDish,
} = require("../controllers/restaurantController");

const {
  validateRestaurant,
  validateSearchQuery,
  validatePagination,
  validateId,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

// Include other resource routers
const dishRouter = require("./dishRoutes");
router.use("/:restaurantId/dishes", dishRouter);

// Restaurant routes
router
  .route("/")
  .get(validatePagination, getAllRestaurants)
  .post(validateRestaurant, createRestaurant);

router.route("/search").get(validateSearchQuery, searchRestaurants);

router.route("/search/dish").get(validateSearchQuery, searchRestaurantsByDish);

router
  .route("/:id")
  .get(validateId("id"), getRestaurant)
  .put(validateId("id"), validateRestaurant, updateRestaurant)
  .delete(validateId("id"), deleteRestaurant);

module.exports = router;
