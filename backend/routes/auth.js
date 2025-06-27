const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../controllers/passport");
require("dotenv").config();

// Start the facebook login
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: "email",
  })
);

// Facebook OAuth callback
router.get(
  "/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `http://localhost:5173/login-failed`,
  }),
  function (req, res) {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;
