const Listing = require("../models/listing");
const { listingSchema } = require("../schema");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new");
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
  res.render("listings/show", { listing });
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
  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.createListing = async (req, res) => {
  let result = listingSchema.validate(req.body);
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(result);

  const newListing = new Listing(req.body.listing);
  newListing.image.url = url;
  newListing.image.filename = filename;
  newListing.owner = req.user._id;
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
