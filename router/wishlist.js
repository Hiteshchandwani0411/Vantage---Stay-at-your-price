const express = require("express");
const {
  addToWishlist,
  removeListing,
  getWishlistPage,
} = require("../controllers/wishlist.controller");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

router.get("/", isLoggedIn, wrapAsync(getWishlistPage));
router.post("/add/:listingId", isLoggedIn, wrapAsync(addToWishlist));
router.delete("/remove/:listingId", isLoggedIn, wrapAsync(removeListing));

module.exports = router;
