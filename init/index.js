require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const categories = require("../utils/categories");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
    console.log("error");
    // console.log(process.env.MONGODB_URL);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = [];
  for (const obj of initData.data) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    let coordinates = [0, 0];
    try {
      const queryText = `${obj.location}, ${obj.country}`;
      const geocodeResult = await maptilerClient.geocoding.forward(queryText, {
        limit: 1,
      });
      if (geocodeResult.features && geocodeResult.features[0]) {
        coordinates = geocodeResult.features[0].geometry.coordinates;
      }
    } catch (err) {
      console.log(`Geocoding failed for "${obj.title}":`, err.message);
    }

    listings.push({
      ...obj,
      owner: "6a341058c723f8c796587088",
      category: randomCategory.value,
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
    });
  }

  await Listing.insertMany(listings);
  console.log("Database Initialized");
};

initDB();
