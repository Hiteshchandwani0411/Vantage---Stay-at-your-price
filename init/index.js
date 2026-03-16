require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

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

  await Listing.insertMany(initData.data);
  console.log("Database Initialized");
};

initDB();
