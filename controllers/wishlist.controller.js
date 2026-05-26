const Wishlist = require("../models/wishlist");

module.exports.addToWishlist = async (req, res) => {
  let listingId = req.params.listingId;
  let userId = req.user ? req.user._id : "65f1a2b3c4d5e6f7a8b9c0d1";

  await Wishlist.create({
    userId,
    listingId,
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Added to wishlist",
      data: newWishlistItem,
    });
};

module.exports.removeListing = async (req, res) => {
  let { listingId } = req.params;
  let userId = req.user ? req.user._id : "65f1a2b3c4d5e6f7a8b9c0d1";

  // findByIdAndDelete ki jagah deleteOne use karenge kyunki hum listingId se delete kar rahe hain
  let removedListing = await Wishlist.deleteOne({
    userId: userId,
    listingId: listingId,
  });
  console.log(removedListing);
};
