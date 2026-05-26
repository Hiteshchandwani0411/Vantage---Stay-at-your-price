const express = require("express");
const { addToWishlist, removeListing } = require("../controllers/wishlist.controller");
const router = express.Router();


router.post("/wishlist/add/:listingId", addToWishlist);
router.delete("/wishlist/remove/:listingId", removeListing);

module.exports = router;