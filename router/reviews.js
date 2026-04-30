const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const {
  createReview,
  destoryReview,
} = require("../controllers/review.controller");

// Create reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destoryReview),
);

module.exports = router;
