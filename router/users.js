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

router.route("/signup").get(signup).post(registerUser);

router
  .route("/login")
  .get(login)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUser,
  );

router.get("/logout", logout);

module.exports = router;
