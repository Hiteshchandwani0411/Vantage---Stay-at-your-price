require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

app.get("/", (req, res) => {
  res.send("Home Route");
});

// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
