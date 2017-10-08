let passport = require('passport');
let User = require('../models/user');
let config = require('../config');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let LocalStrategy = require('passport-local');

// Set up local strategy
const localJwtOptions = { usernameField: 'email' };
const localJwtOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localJwtOptions, function(
  email,
  password,
  done
) {
  // Check if entered email and passport are valid
  // and call done with user
  // otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (!user) {
      return done(null, false);
    }

    // Compare passwords - is 'passworrd' equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err, false);
      }
      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

// Setup options for Jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create Jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in payload exists in our base
  // If it does, call done with that other
  // Call done without user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
