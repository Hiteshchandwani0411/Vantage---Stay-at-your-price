const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true },
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;