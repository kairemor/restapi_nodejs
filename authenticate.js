const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('./models/user');

module.exports = passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());