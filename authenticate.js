const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken')
const config = require('./config/config')
const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt

const User = require('./models/user');

exports.local = passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 6000,
    });
}

var opts = {}
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload :', jwt_payload);
    User.findOne({
        _id: jwt_payload._id
    }, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))

exports.verifyUser = passport.authenticate('jwt', {
    session: false
});

exports.verifyAdmin = (req, res, next) => {
    if (!req.user.admin) {
        res.statusCode = 403;
        const err = new Error("You're not authorize top perform this operation");
        return next(err);
    }
}
exports.verifyOwnUser = (req, comment, next) => {
    if (req.user.username !== comment.author.username) {
        const err = new Error("You're not authorized to perform this operation in comments")
        return next(err)
    }
}