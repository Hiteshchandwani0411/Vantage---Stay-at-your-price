require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./router/listings");
const reviews = require("./router/reviews");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("/*path", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log(`Server is running on http://localhost:${port}`);
});
