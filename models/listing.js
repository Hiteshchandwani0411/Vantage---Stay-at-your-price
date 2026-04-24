const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [5, "Minimum 5 characters required"],
    },
    description: {
      type: String,
    },
    image: {
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1773062177647-76cf543b1795?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>
          (v === ""
            ? "https://images.unsplash.com/photo-1773062177647-76cf543b1795?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            : v),
      },
      filename: {
        type: String,
        default: "listingimage",
      },
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      required: true,
    },
    location: String,
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true },
);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
