const Listing = require("../models/listing");
const Wishlist = require("../models/wishlist");
const { listingSchema } = require("../schema");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  try {
    const PAGE_SIZE = 12;
    const { category, search, sort } = req.query;
    const currentPage = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const filter = {};

    // 1. Category Query Filtering
    if (category && category !== "trending") {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // 2. Text search across title/location/description/country
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: regex },
        { location: regex },
        { country: regex },
        { description: regex },
      ];
    }

    // 3. Sorting (rating is applied in memory after reviews populate)
    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    // 4. Pagination
    const totalListings = await Listing.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalListings / PAGE_SIZE), 1);
    const safePage = Math.min(currentPage, totalPages);

    let allListings = await Listing.find(filter)
      .sort(sortOption)
      .skip((safePage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate("reviews");

    // 5. Wishlist logic
    let wishlistedIds = [];
    if (req.user) {
      const userWishlist = await Wishlist.find({ userId: req.user._id }).select("listingId");
      wishlistedIds = userWishlist.map((item) => item.listingId.toString());
    }

    // 6. Add isWishlisted flag + average rating (needed for rating sort)
    let listingsWithWishlistFlag = allListings.map((listing) => {
      const listingObj = listing.toObject();
      listingObj.isWishlisted = wishlistedIds.includes(listing._id.toString());
      listingObj.avgRating = listingObj.reviews.length
        ? listingObj.reviews.reduce((sum, r) => sum + r.rating, 0) / listingObj.reviews.length
        : 0;
      return listingObj;
    });

    if (sort === "rating") {
      listingsWithWishlistFlag.sort((a, b) => b.avgRating - a.avgRating);
    }

    // 7. Helper to rebuild query string preserving search/category/sort state
    const buildQuery = ({ page } = {}) => {
      const params = new URLSearchParams();
      if (search && search.trim()) params.set("search", search.trim());
      if (category && category !== "trending") params.set("category", category);
      if (sort && sort !== "newest") params.set("sort", sort);
      params.set("page", page || 1);
      return params.toString();
    };

    // 8. Render response
    res.render("listings/index", {
      allListings: listingsWithWishlistFlag,
      page: "explore",
      currentCategory: category || "trending",
      search: search || "",
      sort: sort || "newest",
      currentPage: safePage,
      totalPages,
      totalResults: totalListings,
      paginationQuery: (p) => buildQuery({ page: p }),
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.newListing = (req, res) => {
  res.render("listings/new", { page: "host" });
};

module.exports.showSuggestions = async (req, res) => {
  const term = (req.query.search || "").trim();
  if (term.length < 2) {
    return res.json({ suggestions: [] });
  }

  const regex = new RegExp(term, "i");
  const listings = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { country: regex },
      { description: regex },
    ],
  })
    .limit(8)
    .select("title location country price image")
    .populate("reviews");

  res.json({
    suggestions: listings.map((l) => ({
      _id: l._id,
      title: l.title,
      location: l.location,
      country: l.country,
      price: l.price,
      image: l.image.url,
      avgRating: l.reviews.length
        ? (l.reviews.reduce((sum, r) => sum + r.rating, 0) / l.reviews.length).toFixed(2)
        : null,
    })),
  });
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
    req.flash("error", "No Valid location found!");
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
