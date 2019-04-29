const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const fileStore = require('session-file-store')(session);
const passport = require('passport')

const User = require('../models/user')
const authenticate = require('../authenticate');

const UserRouter = express.Router();
UserRouter.use(bodyParser.json())

UserRouter.use(session({
    name: 'session_id',
    secret: 'kairemor-12345',
    saveUninitialized: false,
    resave: false,
    store: new fileStore()
}))

UserRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req, res, next)
        User.find({})
            .then(users => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(users)
            }, err => next(err))
            .catch(err => next(err))
    })

UserRouter.route('/signup')
    .post((req, res, next) => {
        User.register(new User({
                username: req.body.username
            }),
            req.body.password, (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        err: err.message,
                        status: 'failed'
                    });
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json')
                        res.json({
                            status: 'Registration succesfull'
                        });
                    });
                }
            });
    });

UserRouter.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({
        _id: req.user._id
    })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!'
    });
});

UserRouter.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy()
        res.clearCookie('session_id')
        res.redirect('/')
    } else {
        const err = new Error('You\'re not logged in')
        next(err);
    }
})

module.exports = UserRouter