const User = require("../models/user");

module.exports.signup = (req, res) => {
  res.render("users/signup");
};

module.exports.login = (req, res) => {
  res.render("users/login");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

module.exports.registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    const userRegistered = await User.register(newUser, password);
    // console.log(userRegistered);
    req.login(userRegistered, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Vantage");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back to Vantage!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
