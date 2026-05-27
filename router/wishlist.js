const express = require("express");
const { addToWishlist, removeListing } = require("../controllers/wishlist.controller");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

router.post("/wishlist/add/:listingId", isLoggedIn, wrapAsync(addToWishlist));
router.delete("/wishlist/remove/:listingId", isLoggedIn, wrapAsync(removeListing));

module.exports = router;