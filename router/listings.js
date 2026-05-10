const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
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

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(createListing),
  );

// New listing
router.get("/new", isLoggedIn, newListing);
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner, validateListing, upload.single("listing[image][url]"), wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(destoryListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

module.exports = router;
