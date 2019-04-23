const localStrategy = require('passport-local').Strategy;
const passport = require('passport');

const User = require('./models/user'); 


    
 
module.exports = passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());