const Listing = require("../models/listing");
const Wishlist = require("../models/wishlist");
const { listingSchema } = require("../schema");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  try {
    // URL se query extract ki: e.g., /listings?category=farms
    const { category } = req.query; 
    let allListings = [];

    // 1. Category Query Filtering Logic
    if (!category || category === "trending") {
      // Agar URL me koi query nahi hai (?category= nahi hai) ya fir 'trending' hai
      allListings = await Listing.find({}).populate("reviews");
    } else {
      // Agar specific category aayi hai, toh exact match ya regex filter chalao
      allListings = await Listing.find({
        category: { $regex: new RegExp(category, "i") } // Case-insensitive search
      }).populate("reviews");
    }

    // 2. Wishlist logic (Perfect as always)
    let wishlistedIds = [];
    if (req.user) {
      const userWishlist = await Wishlist.find({ userId: req.user._id }).select("listingId");
      wishlistedIds = userWishlist.map((item) => item.listingId.toString());
    }

    // 3. Adding the isWishlisted flag
    const listingsWithWishlistFlag = allListings.map((listing) => {
      const listingObj = listing.toObject();
      listingObj.isWishlisted = wishlistedIds.includes(listing._id.toString());
      return listingObj;
    });

    // 4. Render response
    res.render("listings/index", {
      allListings: listingsWithWishlistFlag,
      page: "explore",
      currentCategory: category || "trending" // Isse frontend par active category highlight kar sakte ho
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.newListing = (req, res) => {
  res.render("listings/new", { page: "host" });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are requesting for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing, page: "explore" });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are requesting for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload");
  res.render("listings/edit", { listing, originalImageUrl, page: "host" });
};

module.exports.createListing = async (req, res) => {
  let result = listingSchema.validate(req.body);
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  const queryText = `${req.body.listing.location}, ${req.body.listing.country}`;
  const geocodeResult = await maptilerClient.geocoding.forward(queryText, {
    limit: 1,
  });

  if (!geocodeResult.features || geocodeResult.features.length === 0) {
    req.flash("error", "Valid location nahi mil saki!");
    return res.redirect("/listings/new");
  }

  const coordinates = geocodeResult.features[0].geometry.coordinates;

  const newListing = new Listing(req.body.listing);
  if (url && filename) {
    newListing.image.url = url;
    newListing.image.filename = filename;
  }
  newListing.owner = req.user._id;

  newListing.geometry = {
    type: "Point",
    coordinates: coordinates, // [longitude, latitude]
  };
  await newListing.save();
  console.log(newListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true },
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    updatedListing.image.url = url;
    updatedListing.image.filename = filename;
    await updatedListing.save();
  }

  console.log(updatedListing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
