require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const port = process.env.PORT;

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send("Home Route");
});

// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }),
);

// New listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  }),
);

// Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }),
);

// Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    // if (!req.body?.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true },
    );
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);

// Create reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review Saved!");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

// Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

app.all("/*path", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
