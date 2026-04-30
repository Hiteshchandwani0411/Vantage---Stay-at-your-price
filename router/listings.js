const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { populate } = require("../models/review");
const {
  index,
  newListing,
  createListing,
  showListing,
  updateListing,
  destoryListing,
  editListing,
} = require("../controllers/listing.controller");

// Index Route
router.get("/", wrapAsync(index));

// New listing
router.get("/new", isLoggedIn, newListing);

// Show Route
router.get("/:id", wrapAsync(showListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

// Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(updateListing),
);

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destoryListing));

module.exports = router;
