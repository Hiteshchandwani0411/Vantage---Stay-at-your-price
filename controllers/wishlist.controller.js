const Wishlist = require("../models/wishlist");

module.exports.getWishlistPage = async (req, res) => {
  let userId = req.user._id;

  let wishlist = await Wishlist.find({ userId: userId }).populate(
    "listingId",
  );

  console.log(wishlist);
  res.render("users/wishlist", { wishlist });
};

module.exports.addToWishlist = async (req, res) => {
  try {
    let listingId = req.params.listingId;
    let userId = req.user ? req.user._id : "65f1a2b3c4d5e6f7a8b9c0d1";

    await Wishlist.create({
      userId,
      listingId,
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.removeListing = async (req, res) => {
  try {
    let { listingId } = req.params;
    let userId = req.user ? req.user._id : "65f1a2b3c4d5e6f7a8b9c0d1";

    // findByIdAndDelete ki jagah deleteOne use karenge kyunki hum listingId se delete kar rahe hain
    let removedListing = await Wishlist.deleteOne({
      userId: userId,
      listingId: listingId,
    });
    console.log(removedListing);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
