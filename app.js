require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
