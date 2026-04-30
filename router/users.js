const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  signup,
  login,
  logout,
  registerUser,
  loginUser,
} = require("../controllers/user.controller");

router.get("/signup", signup);

router.get("/login", login);

router.get("/logout", logout);

router.post("/signup", registerUser);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginUser,
);

module.exports = router;
