const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const url = 'mongodb://localhost:27017/conFusion';

const Dishe = require('../models/dishes')
const authenticate = require('../authenticate');

const DishRouter = express.Router();
DishRouter.use(bodyParser.json())



/* 
 *Handling the request in the specifiques pafes 
 */
DishRouter.route('/:dishID')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req, res, next)
        res.statusCode = 403;
        res.end("The psot request is not allowed in this route : /dishes/" + req.params.dishID)

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req, res, next)
        Dishe.findByIdAndUpdate(req.params.dishID, {
            $set: req.body
        }, {
            new: true
        })
        return Dishe.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dish)
            }, err => next(err))
            .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        authenticate.verifyAdmin(req, res, next)
        Dishe.findByIdAndDelete(req.params.dishID)
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
/* 
 *Handling the request in the generales pafes 
 */
DishRouter.route('/')
    .get((req, res, next) => {
        Dishe.find({})
            .populate('comments.author')
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishe.create(req.body)
            .then(dishe => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishe)
            }, err => next(err))
            .catch(err => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /dishes ")

    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishe.remove({})
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json')
                res.json(dishes)
            }, err => next(err))
            .catch(err => next(err))
    })
/* 
 *Handling subdocument  specficique 
 */
DishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId +
            '/comments/' + req.params.commentId);

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishe.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log(req.user.username);
                    let comment = dish.comments.id(req.params.commentId);
                    console.log(comment.author.username);
                    authenticate.verifyOwnUser(req, comment, next)
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dishe.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishe.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
/* 
 *Handling subdocument generales 
 */
DishRouter.route('/:dishID/comments')
    .get((req, res, next) => {
        Dishe.findById(req.params.dishID)
            .populate('comments.author')
            .then(dish => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json')
                    res.json(dish.comments)
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishe.findById(req.params.dishID)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            Dishe.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                } else {
                    err = new Error('Dish ' + req.params.dishID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("The put request is not allowed in this route : /dishes" + req.params.dishID + 'comments')
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishe.remove({})
            .then(dishes => {
                if (dish != null) {
                    for (let i = 0; i < dish.comments.length; i++) {
                        dish.comments.id(dish.comments[i]._id).remove()
                    }
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json')
                        })
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err))
    })


module.exports = DishRouter