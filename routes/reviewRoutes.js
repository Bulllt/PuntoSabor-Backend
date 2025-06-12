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
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router.route("/stats/average").get(getAverageRating);

router.route("/stats/distribution").get(getRatingDistribution);

router.route("/user/:userId").get(validateId("userId"), getReviewsByUser);

router
  .route("/rating/:rating")
  .get(validateId("rating"), validatePagination, getReviewsByRating);

router
  .route("/")
  .get(validatePagination, getAllReviews)
  .post(validateReview, authenticate, isAdmin, createReview);

router
  .route("/:reviewId")
  .get(validateId("reviewId"), getReview)
  .put(
    validateId("reviewId"),
    authenticate,
    isAdmin,
    validateReview,
    updateReview
  )
  .delete(validateId("reviewId"), authenticate, isAdmin, deleteReview);

module.exports = router;
