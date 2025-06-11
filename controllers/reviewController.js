const Review = require("../database/models/Review");
const { asyncHandler } = require("../middlewares/errorMiddleware");

const reviewModel = new Review();

// @desc    Get all reviews for a dish
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews
// @access  Public
const getAllReviews = asyncHandler(async (req, res) => {
  const { restaurantId, dishId } = req.params;
  const { limit, sort = "timestamp", order = "desc" } = req.query;

  const reviews = await reviewModel.getAllByDish(
    restaurantId,
    dishId,
    limit,
    sort,
    order
  );

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Get single review
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/:reviewId
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const { restaurantId, dishId, reviewId } = req.params;

  const review = await reviewModel.getById(restaurantId, dishId, reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Create new review
// @route   POST /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews
// @access  Public
const createReview = asyncHandler(async (req, res) => {
  const { restaurantId, dishId } = req.params;

  const review = await reviewModel.create(restaurantId, dishId, req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Update review
// @route   PUT /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/:reviewId
// @access  Public
const updateReview = asyncHandler(async (req, res) => {
  const { restaurantId, dishId, reviewId } = req.params;

  const review = await reviewModel.getById(restaurantId, dishId, reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  const updatedReview = await reviewModel.update(
    restaurantId,
    dishId,
    reviewId,
    req.body
  );

  res.status(200).json({
    success: true,
    data: updatedReview,
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/:reviewId
// @access  Public
const deleteReview = asyncHandler(async (req, res) => {
  const { restaurantId, dishId, reviewId } = req.params;

  const review = await reviewModel.getById(restaurantId, dishId, reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  await reviewModel.delete(restaurantId, dishId, reviewId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

// @desc    Get reviews by user
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/user/:userId
// @access  Public
const getReviewsByUser = asyncHandler(async (req, res) => {
  const { restaurantId, dishId, userId } = req.params;

  const reviews = await reviewModel.getByUserId(restaurantId, dishId, userId);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Get reviews by rating
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/rating/:rating
// @access  Public
const getReviewsByRating = asyncHandler(async (req, res) => {
  const { restaurantId, dishId, rating } = req.params;
  const { limit } = req.query;

  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5",
    });
  }

  const reviews = await reviewModel.getByRating(
    restaurantId,
    dishId,
    ratingNum,
    limit
  );

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Get average rating for a dish
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/stats/average
// @access  Public
const getAverageRating = asyncHandler(async (req, res) => {
  const { restaurantId, dishId } = req.params;

  const stats = await reviewModel.getAverageRating(restaurantId, dishId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Get rating distribution for a dish
// @route   GET /api/v1/restaurants/:restaurantId/dishes/:dishId/reviews/stats/distribution
// @access  Public
const getRatingDistribution = asyncHandler(async (req, res) => {
  const { restaurantId, dishId } = req.params;

  const distribution = await reviewModel.getRatingDistribution(
    restaurantId,
    dishId
  );

  res.status(200).json({
    success: true,
    data: distribution,
  });
});

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUser,
  getReviewsByRating,
  getAverageRating,
  getRatingDistribution,
};
