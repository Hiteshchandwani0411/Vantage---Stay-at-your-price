const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  console.log(req.body.review.rating);

  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("Review Saved!");
  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destoryReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
