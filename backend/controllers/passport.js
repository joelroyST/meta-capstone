const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const facebookId = profile.id;
        console.log(facebookId || "hello");
        
        // Check if user exists in database
        let user = await prisma.user.findUnique({
          where: { facebookId },
        });

        // If user doesn't exist, create a new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: `${profile.name.givenName} ${profile.name.familyName}`,
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : null,
              facebookId,
              provider: "facebook",
            },
          });
        }
        // Complete the passport login process
        return cb(null, user);
      } catch (error) {
        console.error(error);
        cb(error, null);
      }
    }
  )
);

module.exports = passport;