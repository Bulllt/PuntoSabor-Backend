const express = require("express");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUser,
  getReviewsByRating,
  getAverageRating,
  getRatingDistribution,
} = require("../controllers/reviewController");

const {
  validateReview,
  validatePagination,
  validateId,
} = require("../middlewares/validationMiddleware");

const router = express.Router({ mergeParams: true });

// Review statistics routes
router.route("/stats/average").get(getAverageRating);

router.route("/stats/distribution").get(getRatingDistribution);

// Review routes by user
router.route("/user/:userId").get(validateId("userId"), getReviewsByUser);

// Review routes by rating
router
  .route("/rating/:rating")
  .get(validateId("rating"), validatePagination, getReviewsByRating);

// Main review routes
router
  .route("/")
  .get(validatePagination, getAllReviews)
  .post(validateReview, createReview);

router
  .route("/:reviewId")
  .get(validateId("reviewId"), getReview)
  .put(validateId("reviewId"), validateReview, updateReview)
  .delete(validateId("reviewId"), deleteReview);

module.exports = router;
