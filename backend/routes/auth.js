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
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `http://localhost:5173/login-failed`,
  }),
  function (req, res) {
    // Create a JWT
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    // Bring them back to frontend with token
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
